# Multi-Site SEO Blog System: Handover Guide

This document explains the architecture and maintenance of the SEO-optimized blog system implemented across **Roials Capital**, **Roials Alpha**, and **Pathmaker**.

## 🏗️ Architecture Matrix

| Site | Repo | URL | Path | Key Components |
| :--- | :--- | :--- | :--- | :--- |
| **Roials Capital** | `Roials-Capital` | `roialscapital.com` | `/intelligence` | `IntelligenceIndex`, `IntelligenceArticle` |
| **Roials Alpha** | `Alpha` | `hylten.github.io/Alpha` | `/intelligence` | `AlphaIntelligenceIndex`, `AlphaIntelligenceArticle` |
| **Pathmaker** | `Pathmakers` | `hylten.github.io/Pathmakers` | `/insights` | `InsightsIndex`, `InsightsArticle` |

## 🚀 Publishing Workflow (How Plåtniklas works)

To publish a new article:
1. Create a `.md` file in the appropriate content directory:
   - `content/intelligence/` (Capital & Alpha)
   - `content/insights/` (Pathmaker)
2. Ensure correct YAML frontmatter:
   ```yaml
   ---
   title: "Article Title"
   description: "SEOs description"
   date: "2026-03-03"
   author: "Roials Architect"
   slug: "my-article-slug"
   keywords: "keyword1, keyword2"
   ---
   # Markdown content here...
   ```
3. Commit and push to `main`.
4. **GitHub Actions** will automatically:
   - Run `npm run build`.
   - Execute `node scripts/build-seo.js`.
   - Deploy to GitHub Pages (or Vercel/Netlify for custom domains).

## 🛠️ Internal Mechanics

### 1. Route Hijacking (`App.tsx`)
Because these are primarily single-page apps (SPAs) or use `HashRouter`, traditional SEO-friendly URLs are intercepted at the top of `App.tsx`:
```tsx
const path = window.location.pathname;
if (path.includes('/intelligence')) {
  // Capture slug and render the Intelligence components directly
  // Bypasses the main router to allow clean URLs
}
```

### 2. Static HTML Generation (`scripts/build-seo.js`)
Since search engines prefer static pages, this script runs post-build:
- Reads `dist/index.html`.
- Parses every Markdown file in the content directory.
- Creates physical directories (e.g., `dist/intelligence/slug/index.html`).
- Injects the specific `<title>` and `<meta>` tags for that article.
- Generates `sitemap.xml` and `robots.txt` at the root of `dist/`.

### 3. Browser-Safe Parsing
We avoid `gray-matter` in the React components because it depends on Node's `Buffer`. Instead, we use a lightweight `parseFrontmatter` function defined in the Index/Article components to handle metadata extraction in the client.

## ⚠️ Troubleshooting FAQ

### "Black Screen on Sub-folders"
Usually a routing or asset path issue.
- **Fix**: Ensure the `base` in `vite.config.ts` matches the GitHub repo name (e.g., `/Alpha/`).
- **Fix**: Use relative paths in `App.tsx` hijacking logic (using `.includes()` instead of `.startsWith()` helps with sub-directories).

### "404 on Articles"
- **GitHub Pages Subfolder**: Relative links like `/intelligence/slug` fail because they point to the domain root. Links *must* be prefixed with the repo name (e.g., `/Alpha/intelligence/slug`).
- **Trailing Slashes**: URL paths from GitHub Pages often end in `/`. The slug extraction logic in `App.tsx` now strips these automatically: `.replace(/^\/|\/$/g, '')`.

### "Google not finding pages"
- Verify `https://domain.com/sitemap.xml` exists.
- The `build-seo.js` script automatically updates the sitemap with every build.
- Manually submit the sitemap URL to **Google Search Console** for faster indexing.
