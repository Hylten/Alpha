import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';
const STEPS_DIR = '/Users/jonasthevathason/.gemini/antigravity/brain/650d6995-46fb-4207-9499-3ce852248390/.system_generated/steps';

const mappings = [
  { step: '1511', orig: 'agentic-infrastructure-for-crossborder-assets-the-new-liquidity-architecture-for-private-capital.md' },
  { step: '1512', orig: 'agentic-infrastructure-for-global-capital-markets.md' },
  { step: '1513', orig: 'agentic-infrastructure-for-highnetworth-portfolios-the-new-liquidity-architecture.md' },
  { step: '1514', orig: 'agentic-infrastructure-for-private-credit-the-new-liquidity-architecture-for-hnwi-and-uhnw.md' },
  { step: '1515', orig: 'agentic-infrastructure-hnw-liquidity-architecture.md' }
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
    let sanitized = genContent.replace(/^---[\s\S]*?---/m, '');
    sanitized = sanitized.replace(/End of article./gi, '');
    sanitized = sanitized.replace(/Minimum \d+ words. Pure English. Clean markdown./gi, '');
    sanitized = sanitized.replace(/### Phase \d+:/gi, '');
    sanitized = sanitized.replace(/PHASE \d+:/gi, '');
    sanitized = sanitized.replace(/vault_briefing|internal_logic|system_prompt|instruction:/gi, '');
    sanitized = sanitized.replace(/Three truths\.|FOUR TRUTHS|FIVE TRUTHS/gi, '');

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
