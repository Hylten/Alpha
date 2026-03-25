import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'intelligence');

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

console.log(`Analyzing ${files.length} articles...\n`);

let fixed = 0;
let broken = 0;
let issues = [];

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  const data = parsed.data;
  const slug = file.replace('.md', '');
  
  const problems = [];
  
  // Check for broken title (empty or just junk)
  const titleBroken = !data.title || 
    data.title === '' || 
    data.title === '>-' ||
    data.title === 'Article' ||
    data.title === 'Agentic' ||
    data.title === 'Ai' ||
    data.title === 'Sovereign' ||
    data.title === 'Data' ||
    data.title === 'Cross' ||
    data.title === 'The' ||
    data.title === 'Proprietary' ||
    data.title === 'Autonomous' ||
    data.title === 'Predictive' ||
    data.title === 'Synthetic' ||
    data.title === 'Basta';
  
  if (titleBroken) {
    problems.push('broken-title');
  }
  
  // Check for broken description
  const descBroken = !data.description || 
    data.description === '' || 
    data.description === '>-' ||
    data.description === 'Roials Alpha intelligence on agentic infrastructure and liquidity engineering.' ||
    data.description.length < 30;
  
  if (descBroken) {
    problems.push('broken-desc');
  }
  
  // Check for missing author
  if (!data.author || data.author === 'Jonas') {
    problems.push('wrong-author');
  }
  
  if (problems.length > 0) {
    issues.push({ file, slug, problems, data, content: parsed.content });
    broken++;
  }
}

console.log(`Found ${broken} articles with issues\n`);

// Generate proper title from slug
function generateTitleFromSlug(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Generate description from content
function generateDescription(content) {
  const paragraphs = content
    .split('\n\n')
    .filter(p => {
      const t = p.trim();
      return t.length > 80 && 
        !t.startsWith('#') && 
        !t.startsWith('##') && 
        !t.startsWith('###') &&
        !t.startsWith('-') &&
        !t.match(/^\d+\./);
    });
  
  if (paragraphs.length > 0) {
    let desc = paragraphs[0].trim();
    // Clean markdown
    desc = desc.replace(/\*\*(.*?)\*\*/g, '$1');
    desc = desc.replace(/\*(.*?)\*/g, '$1');
    desc = desc.replace(/^#+\s*/gm, '');
    desc = desc.replace(/\[(.*?)\]\(.*?\)/g, '$1');
    desc = desc.replace(/\n/g, ' ').trim();
    
    if (desc.length > 250) {
      desc = desc.substring(0, 247) + '...';
    }
    return desc;
  }
  return 'Proprietary intelligence on asset hardening and institutional capital migration.';
}

// Fix all issues
console.log('Fixing articles...\n');
for (const issue of issues) {
  const filePath = path.join(CONTENT_DIR, issue.file);
  const parsed = matter(fs.readFileSync(filePath, 'utf8'));
  
  let needsFix = false;
  
  // Fix title
  if (issue.problems.includes('broken-title')) {
    parsed.data.title = generateTitleFromSlug(issue.slug);
    needsFix = true;
    console.log(`FIX title: ${issue.file}`);
    console.log(`  -> "${parsed.data.title.substring(0, 60)}..."`);
  }
  
  // Fix description
  if (issue.problems.includes('broken-desc')) {
    parsed.data.description = generateDescription(issue.content);
    needsFix = true;
    console.log(`FIX desc: ${issue.file}`);
    console.log(`  -> "${parsed.data.description.substring(0, 60)}..."`);
  }
  
  // Fix author
  if (issue.problems.includes('wrong-author')) {
    parsed.data.author = 'Jonas Hyltén';
    needsFix = true;
    console.log(`FIX author: ${issue.file}`);
  }
  
  if (needsFix) {
    const updated = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, updated);
    fixed++;
  }
}

console.log(`\n✅ Fixed: ${fixed} articles`);
