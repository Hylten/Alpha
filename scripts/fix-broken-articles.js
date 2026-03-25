import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'intelligence');

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

console.log(`Checking ${files.length} articles...\n`);

const issues = [];
const fixed = [];
const toDelete = [];

// Keywords that indicate duplicate/broken articles
const trashPatterns = [
  /^>/,                    // Starts with >
  /^Execute Process$/,      // Just "Execute Process"
  /^Article$/,             // Just "Article"
  /^Agentic$/,             // Just "Agentic"
  /^Data$/,                // Just "Data"
  /^Basta$/,               // Just "Basta"
  /^Sovereign$/,           // Just "Sovereign"
  /^Ai$/,                  // Just "Ai"
  /^The$/,                 // Just "The"
  /^Proprietary$/,         // Just "Proprietary"
  /^Autonomous$/,          // Just "Autonomous"
  /^Predictive$/,          // Just "Predictive"
  /^Synthetic$/,            // Just "Synthetic"
  /^Cross$/,               // Just "Cross"
];

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  const data = parsed.data;
  const slug = file.replace('.md', '');
  
  // Check for missing/broken frontmatter
  const hasTitle = data.title && data.title.length > 5;
  const hasDescription = data.description && data.description.length > 20;
  const hasDate = data.date;
  
  // Check if title looks broken
  const titleBroken = trashPatterns.some(p => p.test(data.title || ''));
  
  if (!hasTitle || !hasDescription || !hasDate || titleBroken) {
    if (titleBroken) {
      toDelete.push({ file, reason: `Broken title: "${data.title || 'MISSING'}"` });
    } else {
      issues.push({ file, hasTitle, hasDescription, hasDate, title: data.title || 'MISSING' });
    }
  }
  
  // Check for duplicate-like filenames (truncated vs full)
  if (slug.endsWith('.md')) {
    // Already handled
  }
}

console.log('\n=== ARTICLES TO DELETE (broken titles) ===');
for (const item of toDelete) {
  console.log(`DELETE: ${item.file}`);
  console.log(`  Reason: ${item.reason}`);
}

console.log('\n=== ARTICLES MISSING METADATA ===');
for (const item of issues) {
  console.log(`FIX: ${item.file}`);
  console.log(`  Title: ${item.hasTitle ? 'OK' : 'MISSING'} - "${item.title}"`);
  console.log(`  Description: ${item.hasDescription ? 'OK' : 'MISSING'}`);
  console.log(`  Date: ${item.hasDate ? 'OK' : 'MISSING'}`);
}

// Generate descriptions for articles missing them
console.log('\n=== GENERATING DESCRIPTIONS ===');
let generated = 0;
for (const issue of issues) {
  if (!issue.hasDescription) {
    const filePath = path.join(CONTENT_DIR, issue.file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    
    // Generate description from first paragraph
    const paragraphs = parsed.content.split('\n\n').filter(p => p.trim().length > 50);
    const firstPara = paragraphs[0] || '';
    const description = firstPara.substring(0, 200).trim() + '...';
    
    // Add description to frontmatter
    if (!parsed.data.description) {
      parsed.data.description = description;
      
      const updated = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, updated);
      generated++;
      console.log(`Generated description for: ${issue.file}`);
    }
  }
}

console.log(`\nGenerated ${generated} descriptions.`);

// Delete broken articles
console.log('\n=== DELETING BROKEN ARTICLES ===');
for (const item of toDelete) {
  const filePath = path.join(CONTENT_DIR, item.file);
  fs.unlinkSync(filePath);
  console.log(`Deleted: ${item.file}`);
}

console.log(`\nDeleted ${toDelete.length} articles.`);
console.log(`Total issues remaining: ${issues.length - generated + toDelete.length}`);
