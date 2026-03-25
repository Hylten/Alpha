import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';

// Mapping of generated names (truncated/modified) to original names
const mappings = [
  { gen: 'agentic-alpha-the-ai-orchestrated-future-of-crypto-backed-l.md', orig: 'agentic-alpha-the-ai-orchestrated-future-of-crypto-backed-liquidity-engineering.md' },
  { gen: 'agentic-deals-for-the-hnw-era-high-frequency-gtm-structurin.md', orig: 'agentic-deals-for-the-hnw-era-high-frequency-liquidity-structuring-at-institutional-precision.md' },
  { gen: 'agentic-deals--hnw-era-gtm-structuring-re-architecting-dem.md', orig: 'agentic-deals-hnw-era-liquidity-structuring.md' },
  { gen: 'agentic-gtm-infrastructure-ai-first-institutional-architect.md', orig: 'agentic-infrastructure-ai-first-institutional-architecture.md' },
  { gen: 'the-ai-first-gtm-stack-agentic-infrastructure-as-the-sovere.md', orig: 'agentic-infrastructure-ai-first.md' },
  { gen: 'agentic-infrastructure-for-cross-border-market-expansion-th.md', orig: 'agentic-infrastructure-for-crossborder-assets-the-new-liquidity-architecture-for-private-capital.md' },
  { gen: 'agentic-infrastructure-for-global-markets-technical-dominan.md', orig: 'agentic-infrastructure-for-global-capital-markets.md' },
  { gen: 'agentic-infrastructure-for-high-velocity-portfolios-the-new.md', orig: 'agentic-infrastructure-for-highnetworth-portfolios-the-new-liquidity-architecture.md' },
  { gen: 'agentic-infrastructure-for-high-velocity-private-credit-new.md', orig: 'agentic-infrastructure-for-private-credit-the-new-liquidity-architecture-for-hnwi-and-uhnw.md' },
  { gen: 'agentic-infrastructure-for-hnw-liquidity-architecture-the-n.md', orig: 'agentic-infrastructure-hnw-liquidity-architecture.md' }
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

    // Sanitize mandate and person names (just in case)
    let sanitized = genContent.replace(/TECHNICAL MANDATE[\s\S]*?(?:Minimum target size:.*|Minimum mandate depth:.*|$)/gi, '');
    sanitized = sanitized.replace(/Qualification gates strictly observed for comprehensive structural execution\./gi, '');
    sanitized = sanitized.replace(/Access is restricted to approved mandates\./gi, '');
    sanitized = sanitized.replace(/Minimum target size: 500K SEK\+\./gi, '');
    sanitized = sanitized.replace(/Inquire about agentic infrastructure\./gi, '');
    sanitized = sanitized.replace(/^---[\s\S]*?---/m, ''); // Strip redundant frontmatter headers if tool included them

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
