# Roials Alpha - Project Standards

## Brand
- Brand: Roials Alpha
- Author: Jonas Hyltén
- Language: Swedish (sv)
- Voice: INTP-cold, analytical, institutional

## Intelligence Article Pipeline

### Source URLs
Fetch content from these sources:
- https://dealflow-os.com/blog
- https://danishleadco.io/blog
- https://dealroom.net/blog
- https://goliathdata.com/seo-framework-for-off-market-sellers

### Transformation Process
1. Fetch from source URLs
2. Transform to INTP-style (cold, analytical, internal memo)
3. Apply 1-2 copywriting techniques (PAS, AIDA, Contrast, Data Hook)
4. Add technical GTM layer (20-50%): data scraping, autonomous agents, signal-to-deal
5. Apply Humanize Stack

### Humanize Stack (MANDATORY)
1. blader-humanizer: Sentence variance, Status-Terms preservation
2. institutional-voice-protocol: High-conviction, no hedging
3. article-integrity-protocol: Brand standards, `## Sammanfattning` as last heading

### Quality Gates
- Minimum 1500 words per article
- Swedish characters: Å, Ä, Ö
- `##` for section headers (NOT `#`)
- Last heading: `## Sammanfattning`
- NO em-dashes (—)
- Title Case for titles

### Frontmatter Format
```yaml
---
title: "Article Title Here"
description: "Brief description"
date: "YYYY-MM-DD"
author: "Jonas Hyltén"
slug: "url-friendly-slug"
---
```

### Content Structure
```markdown
## Main Section

Content paragraphs with proper line breaks.

## Another Section

More content.

## Sammanfattning

High-conviction closing statement.
```

## Build Commands
```bash
npm run build   # Builds React app + generates SEO HTML
npm run publish # Deploys to GitHub Pages
```
