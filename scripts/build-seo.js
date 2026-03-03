import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'intelligence');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const INTELLIGENCE_DIST_DIR = path.join(DIST_DIR, 'intelligence');

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

    const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    ensureDir(INTELLIGENCE_DIST_DIR);

    // 1. Generate Index Page
    const indexHtml = baseHtml
        .replace(/<title>.*?<\/title>/, '<title>Intelligence | Roials Alpha</title>')
        .replace(/<meta name="description" content=".*?">/, '<meta name="description" content="Proprietary intelligence on asset hardening, institutional migration, and the structural mechanics of Fund III+ expansions.">');

    fs.writeFileSync(path.join(INTELLIGENCE_DIST_DIR, 'index.html'), indexHtml);
    console.log('✅ Generated /dist/intelligence/index.html');

    // 2. Generate Article Pages
    if (!fs.existsSync(CONTENT_DIR)) {
        console.log('No content directory found. Skipping articles.');
        return;
    }

    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(rawContent);

        const slug = data.slug || file.replace('.md', '');
        const title = data.title || 'Intelligence Article';
        const description = data.description || '';

        const articleDir = path.join(INTELLIGENCE_DIST_DIR, slug);
        ensureDir(articleDir);

        const articleHtml = baseHtml
            .replace(/<title>.*?<\/title>/, `<title>${title} | Roials Alpha</title>`)
            .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`);

        fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml);
        console.log(`✅ Generated /dist/intelligence/${slug}/index.html`);
    }

    console.log('SEO Generation Complete!');
}

generateSEO().catch(console.error);
