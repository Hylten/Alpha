import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';
const STEPS_DIR = '/Users/jonasthevathason/.gemini/antigravity/brain/650d6995-46fb-4207-9499-3ce852248390/.system_generated/steps';

const patterns = [
  /### Phase \d+:/gi,
  /PHASE \d+:/gi,
  /Three truths\./gi,
  /THREE TRUTHS/gi,
  /Four truths\./gi,
  /FOUR TRUTHS/gi,
  /Five truths\./gi,
  /FIVE TRUTHS/gi,
  /vault_briefing/gi,
  /internal_logic/gi,
  /system_prompt/gi,
  /instruction:/gi,
  /End of article\./gi,
  /Minimum \d+ words\. Pure English\. Clean markdown\./gi,
  /TECHNICAL MANDATE[\s\S]*?(?:Minimum target size:.*|Minimum mandate depth:.*|$)/gi
];

const mappings = [
  { step: '1609', orig: 'agentic-gtm-deals-for-the-hnw-era-high-frequency-distributi.md' },
  { step: '1610', orig: 'agentic-gtm-architecture-rearchitecting-demand-pipelines-for-sovereign-capital.md' }
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
    
    // Default metadata if file is NEW
    let origData = { title: "Article", description: "", date: new Date().toISOString().split('T')[0], slug: map.orig.replace('.md', '') };
    
    if (fs.existsSync(origPath)) {
        const origFile = fs.readFileSync(origPath, 'utf8');
        const origParsed = matter(origFile);
        origData = origParsed.data;
    }

    // Sanitize any metadata or bleed
    let sanitized = genContent.replace(/^---[\s\S]*?---/m, '');
    for (const p of patterns) {
        sanitized = sanitized.replace(p, '');
    }

    const newContent = `---
title: "${origData.title}"
description: "${(origData.description || '').replace(/"/g, "'")}"
date: "${origData.date}"
author: "Jonas Hyltén"
slug: "${origData.slug}"
---

${sanitized.trim()}
`;

    fs.writeFileSync(origPath, newContent);
    console.log(`Successfully updated: ${origPath}`);
  }
}

cleanupAndReplace();
