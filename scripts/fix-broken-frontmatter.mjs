#!/usr/bin/env node
/**
 * Fix broken YAML frontmatter: remove orphaned lines between title: and description:
 * that lack a YAML key.
 *
 * Usage: node scripts/fix-broken-frontmatter.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = join(process.cwd(), 'content/intelligence');
const DRY_RUN = process.argv.includes('--dry-run');
const files = readdirSync(DIR).filter(f => f.endsWith('.md'));
let fixed = 0;

for (const file of files) {
  const filepath = join(DIR, file);
  let content = readFileSync(filepath, 'utf-8');
  const original = content;

  // Find frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) continue;

  let frontmatter = fmMatch[1];
  const lines = frontmatter.split('\n');
  const newLines = [];
  let skipOrphan = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // If line starts with 'title:' and value is quoted, mark next lines for checking
    if (/^title:\s*"/.test(line)) {
      newLines.push(line);
      // Look ahead: if next lines are indented but NOT a key: value, skip them
      skipOrphan = true;
      continue;
    }

    // If we're skipping orphans, check if this line starts a new key
    if (skipOrphan) {
      if (/^[a-zA-Z0-9_-]+:\s/.test(line)) {
        skipOrphan = false;
        newLines.push(line);
      }
      // else: skip this orphaned line
      continue;
    }

    newLines.push(line);
  }

  const newFrontmatter = newLines.join('\n');
  if (newFrontmatter === frontmatter) continue;

  content = `---\n${newFrontmatter}\n---\n${fmMatch[2]}`;
  fixed++;
  const diff = original.split('\n').length - content.split('\n').length;
  console.log(`${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${file} (${diff} fewer lines)`);
  
  if (!DRY_RUN) {
    writeFileSync(filepath, content, 'utf-8');
  }
}

console.log(`\n${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${fixed}/${files.length} files`);
