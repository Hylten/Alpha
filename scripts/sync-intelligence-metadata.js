#!/usr/bin/env node
/**
 * Backfill intelligence frontmatter from article body (H1, first paragraph, git date).
 * Safe: never deletes files; skips write if nothing to fix.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'intelligence');

function polishText(value) {
  return String(value || '')
    .replace(/>-\s*/g, '')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bGtm\b/g, 'GTM')
    .replace(/\bAbl\b/g, 'ABL')
    .replace(/\bHnw\b/g, 'HNW')
    .replace(/\bUhnw\b/g, 'UHNW')
    .replace(/\bPe\b/g, 'PE')
    .replace(/\bLlms?\b/gi, 'LLM')
    .trim();
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function extractH1(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? polishText(match[1]) : null;
}

function extractDescription(content) {
  const paragraphs = content
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 50 && !p.startsWith('#'));
  if (!paragraphs.length) return '';
  let description = paragraphs[0]
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/\n/g, ' ')
    .trim();
  description = polishText(description);
  return description.length > 200 ? `${description.slice(0, 197)}...` : description;
}

function gitDateFor(filePath) {
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    if (!iso) return null;
    return new Date(iso).toISOString().split('T')[0];
  } catch {
    return null;
  }
}

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
let updated = 0;

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const slug = file.replace('.md', '');
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = { ...parsed.data };
  let changed = false;

  const currentTitle = polishText(data.title);
  if (!currentTitle || currentTitle.length < 3) {
    const nextTitle = extractH1(parsed.content) || titleFromSlug(slug);
    if (nextTitle && nextTitle !== currentTitle) {
      data.title = nextTitle;
      changed = true;
    }
  }

  const genericDesc =
    data.description ===
    'Roials Alpha intelligence on agentic infrastructure and liquidity engineering.';
  const currentDesc = polishText(data.description);
  if (!currentDesc || currentDesc.length < 30 || genericDesc) {
    const nextDesc = extractDescription(parsed.content);
    if (nextDesc && nextDesc !== currentDesc) {
      data.description = nextDesc;
      changed = true;
    }
  }

  if (!data.slug) {
    data.slug = slug;
    changed = true;
  }

  if (!data.author) {
    data.author = 'Jonas Hyltén';
    changed = true;
  }

  const shouldRefreshDate =
    !data.date || data.date === '2026-03-25' || data['re-architected'] === true;
  if (shouldRefreshDate) {
    const gitDate = gitDateFor(path.join('content', 'intelligence', file));
    if (gitDate && gitDate !== data.date) {
      data.date = gitDate;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, matter.stringify(parsed.content, data));
    updated++;
    console.log(`✓ ${file}`);
  }
}

console.log(`\n✅ Updated ${updated} / ${files.length} articles`);
