#!/usr/bin/env node
/**
 * Batch-expand short Roials Alpha articles to 1500+ words using Mistral API.
 * Uses GTM Engineer persona.
 * Usage: node scripts/expand-articles.mjs [--dry-run] [--limit N]
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = join(process.cwd(), 'content/intelligence');
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT_INDEX = process.argv.indexOf('--limit');
const LIMIT = LIMIT_INDEX > -1 ? parseInt(process.argv[LIMIT_INDEX + 1]) : Infinity;

const files = readdirSync(DIR).filter(f => f.endsWith('.md'));
const underTarget = [];

for (const file of files) {
  const filepath = join(DIR, file);
  const content = readFileSync(filepath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) continue;

  const frontmatter = fmMatch[1];
  const body = fmMatch[2];
  const wordCount = body.split(/\s+/).filter(w => w.length > 0).length;

  const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)/);
  const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)/);

  underTarget.push({
    file, filepath, frontmatter, body, wordCount,
    title: titleMatch ? titleMatch[1] : file,
    description: descMatch ? descMatch[1] : '',
  });
}

underTarget.sort((a, b) => a.wordCount - b.wordCount);
const needExpansion = underTarget.filter(a => a.wordCount < 1500).slice(0, LIMIT);

console.log(`\n${underTarget.length} total articles, ${needExpansion.length} under 1500 words\n`);

let expanded = 0;
for (const article of needExpansion) {
  expanded++;
  console.log(`\n[${expanded}/${needExpansion.length}] ${article.file} (${article.wordCount} words)`);

  if (DRY_RUN) continue;

  const prompt = `You are expanding a technical/institutional article to exactly 1500-2000 words for Roials Alpha's intelligence section.

EXISTING ARTICLE (${article.wordCount} words):
Title: "${article.title}"
Description: "${article.description}"

Body:
${article.body.slice(0, 3000)}

RULES:
- Expand to 1500-2000 words total body text
- Keep the SAME title and frontmatter
- Maintain the GTM Engineer voice: technical precision, architectural clarity, institutional authority
- Voice describes systems, infrastructure, and engineering — not opinions or sales pitches
- Use ## for subheadings, ### for subsections
- Short punchy lines for emphasis, dense technical paragraphs for substance
- Add concrete structural analysis, technical mechanisms, and systems architecture
- Use terms: agentic infrastructure, liquidity engineering, asset hardening, institutional-grade, asymmetric advantage
- Direct exit — NO conclusion/summary paragraph like "In conclusion" or "Summary"
- NO markdown code fences in response
- NO sales language ("we offer", "we provide", "we specialize")  
- Respond ONLY with the expanded body text (no frontmatter)`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (process.env.MISTRAL_API_KEY || ''),
      },
      body: JSON.stringify({
        model: 'mistral-large-2411',
        messages: [
          {
            role: 'system',
            content: 'You are a senior GTM Engineer and systems architect for Roials Alpha, the intelligence division of Roials Capital. You design agentic infrastructure for private capital markets. Write with engineering precision, architectural clarity, and institutional authority. Your voice is technical, structural, and systematic — you describe engineered systems, not opinions. Use the Gnosjö tradition: quiet competence, unimpeachable integrity, relentless execution.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`  API error: ${response.status} - ${errText.slice(0, 200)}`);
      continue;
    }

    const data = await response.json();
    const expandedBody = data.choices[0].message.content.trim();

    const newWordCount = expandedBody.split(/\s+/).filter(w => w.length > 0).length;
    if (newWordCount < 1000) {
      console.error(`  Too short: ${newWordCount} words, skipping`);
      continue;
    }

    const cleaned = expandedBody
      .replace(/—/g, ' - ')
      .replace(/\n{4,}/g, '\n\n\n');

    const result = `---\n${article.frontmatter}\n---\n${cleaned}`;
    writeFileSync(article.filepath, result, 'utf-8');
    console.log(`  Expanded to ${newWordCount} words`);

    await new Promise(r => setTimeout(r, 1500));

  } catch (e) {
    console.error(`  Error: ${e.message}`);
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`DONE`);
console.log(`  Files processed: ${expanded}/${needExpansion.length}`);
console.log(`${'='.repeat(50)}\n`);
