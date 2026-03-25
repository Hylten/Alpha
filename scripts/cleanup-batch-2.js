import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';

const mappings = [
  {
    generated: 'agentic-infrastructure-for-cross-border-market-expansion-th.md',
    original: 'agentic-infrastructure-for-crossborder-assets-the-new-liquidity-architecture-for-private-capital.md'
  },
  {
    generated: 'agentic-infrastructure-for-global-markets-technical-dominan.md',
    original: 'agentic-infrastructure-for-global-capital-markets.md'
  }
];

function cleanupAndReplace() {
  for (const map of mappings) {
    const genPath = path.join(CONTENT_DIR, map.generated);
    const origPath = path.join(CONTENT_DIR, map.original);

    if (!fs.existsSync(genPath)) {
      console.log(`Missing generated file: ${genPath}`);
      continue;
    }

    let genContent = fs.readFileSync(genPath, 'utf8');
    const origFile = fs.readFileSync(origPath, 'utf8');
    const origParsed = matter(origFile);

    // Filter out mandate bullshit
    genContent = genContent.replace(/TECHNICAL MANDATE[\s\S]*?(?:Minimum target size:.*|Minimum mandate depth:.*|$)/gi, '');
    genContent = genContent.replace(/Qualification gates strictly observed for comprehensive structural execution\./gi, '');
    genContent = genContent.replace(/Access is restricted to approved mandates\./gi, '');
    genContent = genContent.replace(/Minimum target size: 500K SEK\+\./gi, '');
    genContent = genContent.replace(/Inquire about agentic infrastructure\./gi, '');

    const newContent = `---
title: "${origParsed.data.title}"
description: "${origParsed.data.description.replace(/"/g, "'")}"
date: "${origParsed.data.date}"
author: "Jonas Hyltén"
slug: "${origParsed.data.slug}"
---

${genContent.trim()}
`;

    fs.writeFileSync(origPath, newContent);
    fs.unlinkSync(genPath);
    console.log(`Successfully updated: ${origPath}`);
  }
}

cleanupAndReplace();
