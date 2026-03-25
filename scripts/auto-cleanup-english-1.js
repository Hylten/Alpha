import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';
const STEPS_DIR = '/Users/jonasthevathason/.gemini/antigravity/brain/650d6995-46fb-4207-9499-3ce852248390/.system_generated/steps';

const mappings = [
  { step: '1493', orig: 'agentic-alpha-the-ai-orchestrated-future-of-crypto-backed-liquidity-engineering.md' },
  { step: '1499', orig: 'agentic-deals-for-the-hnw-era-high-frequency-liquidity-structuring-at-institutional-precision.md' },
  { step: '1500', orig: 'agentic-deals-hnw-era-liquidity-structuring.md' },
  { step: '1501', orig: 'agentic-infrastructure-ai-first-institutional-architecture.md' },
  { step: '1502', orig: 'agentic-infrastructure-ai-first.md' }
];

function cleanupAndReplace() {
  for (const map of mappings) {
    const genPath = path.join(STEPS_DIR, map.step, 'output.txt');
    const origPath = path.join(CONTENT_DIR, map.orig);

    if (!fs.existsSync(genPath)) {
      console.log(`Missing generated file: ${genPath}`);
      continue;
    }

    let genContent = fs.readFileSync(genPath, 'utf8');
    const origFile = fs.readFileSync(origPath, 'utf8');
    const origParsed = matter(origFile);

    // Sanitize any metadata or bleed
    let sanitized = genContent.replace(/TECHNICAL MANDATE[\s\S]*?(?:Minimum target size:.*|Minimum mandate depth:.*|$)/gi, '');
    sanitized = sanitized.replace(/^---[\s\S]*?---/m, '');
    sanitized = sanitized.replace(/Minimum 2000 words. Pure English. Clean markdown./gi, '');
    sanitized = sanitized.replace(/End of article./gi, '');

    const newContent = `---
title: "${origParsed.data.title}"
description: "${origParsed.data.description.replace(/"/g, "'")}"
date: "${origParsed.data.date}"
author: "Jonas Hyltén"
slug: "${origParsed.data.slug}"
---

${sanitized.trim()}
`;

    fs.writeFileSync(origPath, newContent);
    console.log(`Successfully updated with English long-form: ${origPath}`);
  }
}

cleanupAndReplace();
