#!/usr/bin/env node
/**
 * Fix frontmatter leakage, list formatting, and redundancy across all articles.
 *
 * Fixes:
 * 1. Frontmatter title: remove YAML block scalars containing markdown # syntax
 * 2. Numbered lists: remove blank lines between items
 *
 * Usage: node scripts/fix-frontmatter-lists.mjs [--dry-run]
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

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) continue;

  let frontmatter = fmMatch[1];
  let body = fmMatch[2];
  let changed = false;

  // === Fix 1: Clean up frontmatter title ===
  // Pattern: YAML block scalar with markdown heading inside
  const titleBlockMatch = frontmatter.match(/^title:\s*[>|][-]?\n((?:  .*\n?)*)/m);
  if (titleBlockMatch) {
    const block = titleBlockMatch[1];
    const headingMatch = block.match(/^\s*#+\s+(.+)$/m);
    if (headingMatch) {
      const cleanTitle = headingMatch[1].trim().replace(/\s{2,}/g, ' ');
      frontmatter = frontmatter.replace(
        /^title:\s*[>|][-]?\n((?:  .*\n?)*)/m,
        `title: ${JSON.stringify(cleanTitle)}`
      );
      changed = true;
    }
  }

  // === Fix 2: Fix numbered list blank lines ===
  // Remove blank lines between numbered items that have indented content
  // Pattern: "N. title\n   indented content\n\nM. next title"
  // → "N. title\n   indented content\nM. next title"
  body = body.replace(
    /(\n\d+\.\s[^\n]*(?:\n  [^\n]*)*)\n\n(?=\d+\.\s)/g,
    '$1\n'
  );
  // Also handle: last line of numbered item is not indented but is still part of item
  body = body.replace(
    /(\n\d+\.\s[^\n]*)\n\n(?=\d+\.\s)/g,
    '$1\n'
  );

  if (body !== fmMatch[2]) {
    changed = true;
  }

  if (!changed) continue;

  content = `---\n${frontmatter}\n---\n${body}`;

  if (content !== original) {
    fixed++;
    const lineDiff = original.split('\n').length - content.split('\n').length;
    console.log(`${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${file} (${lineDiff} fewer lines)`);
    if (!DRY_RUN) {
      writeFileSync(filepath, content, 'utf-8');
    }
  }
}

console.log(`\n${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${fixed}/${files.length} files`);
