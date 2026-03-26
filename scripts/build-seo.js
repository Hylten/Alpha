import fs from 'fs'; // Build trigger
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'intelligence');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const INTELLIGENCE_DIST_DIR = path.join(DIST_DIR, 'intelligence');

const SITE_URL = 'https://hylten.github.io/Alpha';

const today = new Date().toISOString().split('T')[0];



const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

async function generateSEO() {
    console.log('Generating SEO Static HTML for Alpha Intelligence...');

    if (!fs.existsSync(DIST_DIR)) {
        console.error('dist directory not found. Please run npm run build first.');
        process.exit(1);
    }

    const indexHtmlPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
        console.error('dist/index.html not found. Please run npm run build first.');
        process.exit(1);
    }


    // Tracking Injection
    let trackingScript = '';
    try {
        const configPath = path.join(__dirname, '../../seo_config.json');
        if (fs.existsSync(configPath)) {
            const seoConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (seoConfig.tracking.google_analytics_id) {
                trackingScript += `
                <!-- Google tag (gtag.js) -->
                <script async src="https://www.googletagmanager.com/gtag/js?id=${seoConfig.tracking.google_analytics_id}"></script>
                <script>
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${seoConfig.tracking.google_analytics_id}');
                </script>`;
            }
            if (seoConfig.tracking.search_console_id) {
                trackingScript += `
<meta name="google-site-verification" content="${seoConfig.tracking.search_console_id}" />`;
            }
        }
    } catch (e) {
        console.warn('⚠️ No seo_config.json found or failed to parse. Skipping tracking injection.');
    }

    const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8')
        .replace('</head>', `${trackingScript}
</head>`);

    ensureDir(INTELLIGENCE_DIST_DIR);

    const files = fs.existsSync(CONTENT_DIR) ? fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md')) : [];

    // 1. Generate Index Page with Pre-rendered content for FCP
    let listHtml = '<div style="background: #0a0a0a !important; min-height: 100vh; padding: 180px 24px; color: #E5E7EB; display: flex; flex-direction: column; align-items: center; overflow-x: hidden;">';
    listHtml += '<h1 style="font-size: clamp(3.5rem, 10vw, 8rem); color: #F3F4F6 !important; margin-bottom: 60px; font-weight: 400; font-family: serif; letter-spacing: -0.05em; line-height: 1; text-align: center;">Intelligence <span style="font-style: italic; color: #333; font-weight: 300;">Archive</span></h1>';
    listHtml += '<p style="font-size: 1.25rem; color: #9CA3AF; max-width: 700px; margin: 0 auto 200px; line-height: 1.6; font-weight: 300; text-align: center;">Proprietary research on agentic AI infrastructure, private debt architecture, and the technical mechanics of sovereign capital migration.</p>';
    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(rawContent);
        
        let title = data.title || 'Intelligence Report';
        let description = data.description || '';
        
        // Clean up YAML artifacts and fix common capitalization issues
        description = description.replace(/>-\s*/g, '').replace(/\bAi\b/g, 'AI').replace(/\bGtm\b/g, 'GTM').replace(/\bAbl\b/g, 'ABL').replace(/\bHnw\b/g, 'HNW').replace(/\bUhnw\b/g, 'UHNW').replace(/\bPe\b/g, 'PE').replace(/\bLlms?\b/gi, 'LLM');
        title = title.replace(/\bAi\b/g, 'AI').replace(/\bGtm\b/g, 'GTM').replace(/\bAbl\b/g, 'ABL').replace(/\bHnw\b/g, 'HNW').replace(/\bUhnw\b/g, 'UHNW').replace(/\bPe\b/g, 'PE').replace(/\bLlms?\b/gi, 'LLM');
        
        const slug = data.slug || file.replace('.md', '');
        const date = data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

        listHtml += `
            <article style="margin-bottom: 300px; width: 100%; max-width: 900px; display: flex; flex-direction: column; align-items: center; text-align: center; padding-bottom: 150px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="font-size: 11px; color: #F3F4F6; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 80px; font-weight: 700; opacity: 0.8;">Release &mdash; ${date}</div>
                <a href="/Alpha/intelligence/${slug}/" style="text-decoration: none !important; color: #E5E7EB !important; display: block; width: 100%;">
                    <h2 style="font-size: clamp(2.2rem, 5vw, 4.2rem); color: #F3F4F6 !important; margin-bottom: 40px; font-weight: 400; font-family: serif; line-height: 1.2; text-align: center; max-width: 850px; margin-left: auto; margin-right: auto;">${title}</h2>
                    <p style="font-size: 1.25rem; color: #9CA3AF !important; line-height: 1.8; font-weight: 300; margin-bottom: 60px; max-width: 600px; margin-left: auto; margin-right: auto; text-align: center;">${description}</p>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <span style="color: #E5E7EB; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; font-weight: 700; border-bottom: 1px solid #F3F4F6; padding-bottom: 8px;">Access Intelligence</span>
                    </div>
                </a>
            </article>`;
    }
    listHtml += '</div>';

    const sharedButtons = `
        <div style="display: flex; justify-content: center; margin-top: 100px; padding-bottom: 60px; width: 100%;">
          <a href="/Alpha/" style="padding: 10px 24px; background: rgba(10,10,10,0.8); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); color: #F3F4F6; text-decoration: none; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family: sans-serif; font-weight: 500;">
            Return Home
          </a>
        </div>
        <a href="https://wa.me/46701619978?text=Regarding%20Roials%20Alpha:" target="_blank" rel="noopener noreferrer" style="position: fixed; bottom: 32px; right: 32px; z-index: 10000; background: #1a1a1a; padding: 12px; border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); opacity: 0.6; transition: opacity 0.3s; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; box-sizing: border-box;">
          <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
    `
        const indexHtml = baseHtml
        .replace(/<title>.*?<\/title>/, '<title>Intelligence | Roials Alpha</title>')
        .replace(/<meta name="description" content=".*?">/, '<meta name="description" content="Proprietary intelligence on asset hardening, institutional migration, and the structural mechanics of Fund III+ expansions.">')
        .replace('</head>', `  <link rel="canonical" href="${SITE_URL}/intelligence/" />\n</head>`)
        .replace('<div id="root"></div>', `<div id="root">${listHtml}${sharedButtons}</div>`);

    fs.writeFileSync(path.join(INTELLIGENCE_DIST_DIR, 'index.html'), indexHtml);
    console.log('✅ Generated /dist/intelligence/index.html');

    const feedItems = [];

    // 2. Generate Article Pages
    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(rawContent);

        const slug = data.slug || file.replace('.md', '');
        const title = data.title || 'Intelligence Article';
        const description = data.description || '';
        const date = data.date || today;
        const author = data.author || 'Roials Alpha';

        feedItems.push({
            id: slug,
            url: `${SITE_URL}/intelligence/${slug}/`,
            title: title,
            summary: description,
            date_published: new Date(date).toISOString(),
            author: { name: author }
        });

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "author": { "@type": "Person", "name": author },
            "publisher": { 
                "@type": "Organization", 
                "name": "Roials Alpha",
                "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` }
            },
            "datePublished": date,
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/intelligence/${slug}/` }
        };

        const articleDir = path.join(INTELLIGENCE_DIST_DIR, slug);
        ensureDir(articleDir);

        const contentHtml = `<div style="background: #0a0a0a; min-height: 100vh; padding: 220px 24px; color: #E5E7EB; font-family: 'Inter', sans-serif;">
            <div style="max-width: 820px; margin: 0 auto;">
                <h1 style="font-family: serif; font-size: clamp(2.5rem, 6vw, 4.5rem); color: #F3F4F6; margin-bottom: 80px; line-height: 1.1; font-weight: 300;">${title}</h1>
                <div style="line-height: 2.2; font-size: 1.25rem; color: #D1D5DB !important; font-weight: 300; width: 100%; text-align: left; margin-bottom: 120px;">
                    ${content.split('\n').map(p => {
                        const trimmed = p.trim();
                        if (!trimmed) return '';
                        
                        // Handle headers #, ##, ### (with or without space)
                        if (trimmed.startsWith('###')) {
                            const headerText = trimmed.replace(/^###\s*/, '');
                            return `<h3 style="font-size: 1.8rem; color: #F3F4F6; margin: 80px 0 40px; font-weight: 500; font-family: serif; line-height: 1.2; text-align: left;">${headerText}</h3>`;
                        }
                        if (trimmed.startsWith('##')) {
                            const headerText = trimmed.replace(/^##\s*/, '');
                            return `<h2 style="font-size: 2.4rem; color: #F3F4F6; margin: 100px 0 50px; font-weight: 400; font-family: serif; line-height: 1.2; text-align: left;">${headerText}</h2>`;
                        }
                        if (trimmed.startsWith('#')) {
                            const headerText = trimmed.replace(/^#\s*/, '');
                            return `<h2 style="font-size: 3.2rem; color: #F3F4F6; margin: 120px 0 60px; font-weight: 300; font-family: serif; line-height: 1.1; text-align: left;">${headerText}</h2>`;
                        }


                        let html = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FFFFFF; font-weight: 600;">$1</strong>');
                        html = html.replace(/\*(.*?)\*/g, '<em style="color: #FFFFFF; font-style: italic;">$1</em>');
                        
                        return `<p style="margin-bottom: 40px; display: block; width: 100%; text-align: left;">${html}</p>`;
                    }).join('')}
                </div>
            </div>
        </div>`;


        const articleHtml = baseHtml
            .replace(/<title>.*?<\/title>/, `<title>${title} | Roials Alpha</title>`)
            .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`)
            .replace('</head>', `  <link rel="canonical" href="${SITE_URL}/intelligence/${slug}/" />\n  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>\n</head>`)
            .replace('<div id="root"></div>', `<div id="root">${contentHtml}${sharedButtons}</div>`);

        fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml);
        console.log(`✅ Generated /dist/intelligence/${slug}/index.html`);
    }

    // 3. Generate sitemap.xml
    let sitemapUrls = `  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/intelligence/</loc>
    <lastmod>${today}</lastmod>
    <priority>0.9</priority>
  </url>`;

    for (const item of feedItems) {
        sitemapUrls += `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.date_published.split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>`;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
    console.log('✅ Generated /dist/sitemap.xml');

    // 4. Generate JSON Feed
    const feed = {
        version: "https://jsonfeed.org/version/1.1",
        title: "Roials Alpha Intelligence",
        home_page_url: SITE_URL,
        feed_url: `${SITE_URL}/feed.json`,
        items: feedItems
    };
    fs.writeFileSync(path.join(DIST_DIR, 'feed.json'), JSON.stringify(feed, null, 2));
    console.log('✅ Generated /dist/feed.json');

    // 5. Generate robots.txt
    const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;

    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots);
    console.log('✅ Generated /dist/robots.txt');

    console.log('SEO Generation Complete!');
}

generateSEO().catch(console.error);
