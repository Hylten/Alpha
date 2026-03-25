import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'intelligence');

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

console.log(`Fixing ${files.length} articles...\n`);

let fixed = 0;
let deleted = 0;

// Known bad articles (truncated slugs, duplicates, etc)
const badSlugs = new Set([
  'agentic-alpha-the-ai-orchestrated-future-of-crypto-backed-l', // truncated
  'agentic-gtm-deals-for-the-hnw-era-high-frequency-distributi', // truncated
  'agentic-gtm-for-cross-border-markets-technical-protocols-fo', // truncated
  'agentic-infrastructure-for-global-capital-markets-engineeri', // truncated
]);

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const slug = file.replace('.md', '');
  
  // Delete obviously bad articles
  if (badSlugs.has(slug)) {
    fs.unlinkSync(filePath);
    console.log(`DELETED (truncated): ${file}`);
    deleted++;
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  const data = parsed.data;
  
  let needsUpdate = false;
  
  // Fix missing or short description
  if (!data.description || data.description.length < 30) {
    // Generate from first substantial paragraph
    const paragraphs = parsed.content
      .split('\n\n')
      .filter(p => {
        const t = p.trim();
        return t.length > 50 && !t.startsWith('#') && !t.startsWith('##') && !t.startsWith('###');
      });
    
    if (paragraphs.length > 0) {
      let description = paragraphs[0].trim();
      // Clean markdown
      description = description.replace(/\*\*(.*?)\*\*/g, '$1');
      description = description.replace(/\*(.*?)\*/g, '$1');
      description = description.replace(/^#+\s*/gm, '');
      description = description.replace(/\n/g, ' ').trim();
      
      // Limit to ~200 chars
      if (description.length > 200) {
        description = description.substring(0, 197) + '...';
      }
      
      data.description = description;
      needsUpdate = true;
      console.log(`FIXED description: ${file}`);
      console.log(`  -> "${description.substring(0, 80)}..."`);
    }
  }
  
  // Fix missing date - set to file creation date or today
  if (!data.date) {
    data.date = new Date().toISOString().split('T')[0];
    needsUpdate = true;
    console.log(`FIXED date: ${file}`);
  }
  
  // Fix missing title
  if (!data.title || data.title.length < 5) {
    // Generate title from slug
    data.title = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    needsUpdate = true;
    console.log(`FIXED title: ${file}`);
  }
  
  // Fix author
  if (!data.author) {
    data.author = 'Jonas Hyltén';
    needsUpdate = true;
  }
  
  // Fix slug if missing
  if (!data.slug) {
    data.slug = slug;
    needsUpdate = true;
  }
  
  if (needsUpdate) {
    const updated = matter.stringify(parsed.content, data);
    fs.writeFileSync(filePath, updated);
    fixed++;
  }
}

console.log(`\n✅ Fixed: ${fixed} articles`);
console.log(`🗑️ Deleted: ${deleted} articles`);
