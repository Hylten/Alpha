import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';

const mappings = [
  { gen: 'agentic-gtm-infrastructure-architecture-beyond-legacy-syste.md', orig: 'agentic-infrastructure-the-new-architecture-beyond-buy-borrow-die.md' },
  { gen: 'the-new-standard-for-high-performance-gtm-agentic-engineeri.md', orig: 'agentic-infrastructure-the-new-standard-for-high.md' },
  { gen: 'future-of-gtm-intelligence-how-ai-driven-signaling-systems.md', orig: 'agentic-intelligence-and-the-future-of-abl-how-ai-driven-credit-systems-redefine-liquidity.md' },
  { gen: 'agentic-gtm-intelligence-the-new-architecture-of-demand-gen.md', orig: 'agentic-intelligence-and-the-new-architecture-of-capital.md' },
  { gen: 'agentic-gtm-intelligence-re-architecting-private-market-pip.md', orig: 'agentic-intelligence-and-the-new-architecture-of-private-debt.md' },
  { gen: 'asset-based-gtm-liquidity-the-technical-architecture-of-mar.md', orig: 'agentic-intelligence-asset-based-liquidity-architecture.md' },
  { gen: 'agentic-gtm-intelligence-for-complex-market-entry-engineeri.md', orig: 'agentic-intelligence-for-complex-ma-liquidity.md' },
  { gen: 'future-of-gtm-sourcing-asset-based-intelligence-for-high-ve.md', orig: 'agentic-intelligence-future-asset-based-lending.md' },
  { gen: 'the-future-of-asset-based-gtm-orchestrating-autonomous-mark.md', orig: 'agentic-intelligence-future-of-asset-based-lending.md' },
  { gen: 'market-and-demand-engineering-agentic-gtm-liquidity-as-sove.md', orig: 'agentic-intelligence-mna-liquidity-engineering.md' }
];

function cleanupAndReplace() {
  for (const map of mappings) {
    const genPath = path.join(CONTENT_DIR, map.gen);
    const origPath = path.join(CONTENT_DIR, map.orig);

    if (!fs.existsSync(genPath)) {
      console.log(`Missing generated file: ${genPath}`);
      continue;
    }

    let genContent = fs.readFileSync(genPath, 'utf8');
    const origFile = fs.readFileSync(origPath, 'utf8');
    const origParsed = matter(origFile);

    let sanitized = genContent.replace(/TECHNICAL MANDATE[\s\S]*?(?:Minimum target size:.*|Minimum mandate depth:.*|$)/gi, '');
    sanitized = sanitized.replace(/Qualification gates strictly observed for comprehensive structural execution\./gi, '');
    sanitized = sanitized.replace(/Access is restricted to approved mandates\./gi, '');
    sanitized = sanitized.replace(/Minimum target size: 500K SEK\+\./gi, '');
    sanitized = sanitized.replace(/Inquire about agentic infrastructure\./gi, '');
    sanitized = sanitized.replace(/^---[\s\S]*?---/m, '');

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
    fs.unlinkSync(genPath);
    console.log(`Successfully updated: ${origPath}`);
  }
}

cleanupAndReplace();
