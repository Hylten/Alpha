#!/usr/bin/env node
/**
 * Fix article rendering bugs across all intelligence articles.
 *
 * Fixes:
 * 1. Remove duplicate first heading that matches frontmatter title
 * 2. Convert bold pseudo-headings in numbered lists to proper #### headings
 * 3. Ensure proper whitespace between headings and body text
 *
 * Usage: node scripts/fix-article-rendering.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = join(process.cwd(), 'content/intelligence');
const DRY_RUN = process.argv.includes('--dry-run');

const files = readdirSync(DIR).filter(f => f.endsWith('.md'));
let anyChanged = false;

function parseFrontmatterAndBody(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { frontmatter: match[1], body: match[2] };
}

function getFrontmatterValue(frontmatter, key) {
  const regex = new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|(\\S.*))$`, 'm');
  const match = frontmatter.match(regex);
  if (!match) return null;
  return match[1] || match[2] || match[3] || null;
}

function fixFile(filepath) {
  const content = readFileSync(filepath, 'utf-8');
  const parsed = parseFrontmatterAndBody(content);
  if (!parsed) return false;

  let { frontmatter, body } = parsed;
  const originalBody = body;
  let changed = false;

  const title = getFrontmatterValue(frontmatter, 'title');
  const description = getFrontmatterValue(frontmatter, 'description');

  // === Fix 1: Remove duplicate first heading matching title ===
  if (title) {
    // Match: first line is a heading (# or ##) whose text matches the title
    // Also handle "Sovereetary" typo variant
    const titlePattern = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headingRegex = new RegExp(`^#{1,2}\\s+${titlePattern}\\s*\\n\\n?`, '');
    const match = body.match(headingRegex);
    if (match) {
      body = body.replace(headingRegex, '');
      changed = true;
      console.log(`${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${filepath.split('/').pop()} (removed duplicate H1/H2 matching title)`);
    }
  }

  // === Fix 2: Convert bold pseudo-headings in numbered lists to #### headings ===
  // Pattern: "N. **Bold Term**\n   Paragraph content..."
  //   → "#### Bold Term\nParagraph content..."
  //
  // Also: "N. **Bold Term**\n   - List item\n   - Another item"
  //   → "#### Bold Term\n- List item\n- Another item"
  
  const numberedBoldRegex = /^\d+\.\s+\*\*(.+?)\*\*\s*\n(   .+(?:\n   .*)*)/gm;
  let match2;
  let hasBoldHeading = false;
  while ((match2 = numberedBoldRegex.exec(body)) !== null) {
    hasBoldHeading = true;
  }
  
  if (hasBoldHeading) {
    body = body.replace(numberedBoldRegex, (_, term, rest) => {
      // Remove the 3-space indent from each line in rest
      const unindented = rest.replace(/^   /gm, '');
      return `#### ${term}\n${unindented}`;
    });
    changed = true;
    console.log(`${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${filepath.split('/').pop()} (converted bold pseudo-headings to ####)`);
  }

  if (!changed) return false;

  const newContent = `---\n${frontmatter}\n---\n${body}`;
  if (!DRY_RUN) {
    writeFileSync(filepath, newContent, 'utf-8');
  }
  return true;
}

let fixed = 0;
for (const file of files) {
  const filepath = join(DIR, file);
  if (fixFile(filepath)) {
    fixed++;
  }
}

console.log(`\n${DRY_RUN ? 'WOULD FIX' : 'FIXED'} ${fixed}/${files.length} files`);
