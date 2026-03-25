import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';

const mappings = [
  {
    generated: 'agentic-alpha-the-ai-orchestrated-future-of-crypto-backed-l.md',
    original: 'agentic-alpha-the-ai-orchestrated-future-of-crypto-backed-liquidity-engineering.md'
  },
  {
    generated: 'agentic-deals-for-the-hnw-era-high-frequency-gtm-structurin.md',
    original: 'agentic-deals-for-the-hnw-era-high-frequency-liquidity-structuring-at-institutional-precision.md'
  },
  {
    generated: 'agentic-deals--hnw-era-gtm-structuring-re-architecting-dem.md',
    original: 'agentic-deals-hnw-era-liquidity-structuring.md'
  },
  {
    generated: 'agentic-gtm-infrastructure-ai-first-institutional-architect.md',
    original: 'agentic-infrastructure-ai-first-institutional-architecture.md'
  },
  {
    generated: 'the-ai-first-gtm-stack-agentic-infrastructure-as-the-sovere.md',
    original: 'agentic-infrastructure-ai-first.md'
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

    // Some generated ones might have titles/headers we want to keep, 
    // but the frontmatter should come from the original (updated with author Jonas Hyltén)
    
    // 1. Remove Mandate Block from generated content
    const mandateBlockRegex = /TECHNICAL MANDATE[\s\S]*?(?:Minimum target size:.*|Minimum mandate depth:.*|$)/gi;
    genContent = genContent.replace(mandateBlockRegex, '');
    genContent = genContent.replace(/Qualification gates strictly observed for comprehensive structural execution\./gi, '');
    genContent = genContent.replace(/Access is restricted to approved mandates\./gi, '');
    genContent = genContent.replace(/Minimum target size: 500K SEK\+\./gi, '');
    genContent = genContent.replace(/Inquire about agentic infrastructure\./gi, '');

    // 2. Ensure frontmatter is correct
    // If the generated file has its own frontmatter, gray-matter should handle it
    // But sometimes it doesn't. Let's just wrap the genContent in the original frontmatter markers
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
    console.log(`Successfully updated: ${origPath}`);

    // Delete generated temporary file
    fs.unlinkSync(genPath);
  }
}

cleanupAndReplace();
