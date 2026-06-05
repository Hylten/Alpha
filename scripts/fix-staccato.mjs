#!/usr/bin/env node
/**
 * Fix staccato formatting in Roials Alpha articles.
 * Consolidates sentence-per-line into proper paragraphs.
 * Fixes heading hierarchy (H1 for title, H2 for sections).
 *
 * Usage: node scripts/fix-staccato.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = join(process.cwd(), 'content/intelligence');
const DRY_RUN = process.argv.includes('--dry-run');

const files = readdirSync(DIR).filter(f => f.endsWith('.md'));
let totalFixed = 0;

for (const file of files) {
  const filepath = join(DIR, file);
  let content = readFileSync(filepath, 'utf-8');
  const original = content;

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) continue;

  const frontmatter = fmMatch[1];
  let body = fmMatch[2];

  // Step 1: Fix heading hierarchy — first H1 is title, rest become H2
  const lines = body.split('\n');
  let titleSeen = false;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      if (!titleSeen) {
        titleSeen = true;
      } else {
        lines[i] = '#' + lines[i];
      }
    }
  }
  body = lines.join('\n');

  // Step 2: Consolidate staccato lines into paragraphs
  // Strategy: ignore blank lines between text. Only flush paragraph
  // when we hit a heading, list item, or EOF.
  const bodyLines = body.split('\n');
  const result = [];
  let paraBuffer = [];

  function flushPara() {
    if (paraBuffer.length === 0) return;
    const joined = paraBuffer.join(' ').replace(/\s+/g, ' ').trim();
    if (joined) result.push(joined);
    paraBuffer = [];
  }

  for (const line of bodyLines) {
    const trimmed = line.trim();

    // Skip blank lines entirely — they are just staccato artifacts
    if (trimmed === '') continue;

    // Heading — flush buffer, keep heading
    if (trimmed.match(/^#{1,3}\s/)) {
      flushPara();
      result.push(line);
      continue;
    }

    // List item — flush buffer, keep list item
    if (trimmed.match(/^[-*]\s/) || trimmed.match(/^\d+\.\s/)) {
      flushPara();
      result.push(line);
      continue;
    }

    // Regular text line — buffer it (will merge with adjacent lines)
    paraBuffer.push(trimmed);
  }

  flushPara();

  // Separate each structural element with a blank line
  const finalBody = result.join('\n\n');

  content = `---\n${frontmatter}\n---\n${finalBody}`;

  if (content !== original) {
    totalFixed++;
    const wordCount = finalBody.split(/\s+/).filter(w => w.length > 0).length;
    const totalLines = finalBody.split('\n').length;
    console.log(`${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${file} — ${wordCount} words, ${totalLines} lines`);
    if (!DRY_RUN) {
      writeFileSync(filepath, content, 'utf-8');
    }
  }
}

console.log(`\n${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${totalFixed}/${files.length} files`);
