import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = '/Users/jonasthevathason/AI Agents =)/Roials-Alpha/content/intelligence';

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function fixHeaders(content) {
  let fixed = content;
  
  // Convert standalone # headers (not ## or ###) to ## 
  // This regex matches lines that start with # but NOT ## or ###
  fixed = fixed.replace(/^# ([^\n#].+)$/gm, '## $1');
  
  // Also fix cases where # is at start without space
  fixed = fixed.replace(/^#([^\s#].+)$/gm, '## $1');
  
  return fixed;
}

function fixArticle(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(rawContent);
  
  // Skip if already fixed
  if (data.title && data.title === data.title.toUpperCase()) {
    console.log(`Already fixed: ${path.basename(filePath)}`);
    return false;
  }
  
  // Generate slug from filename if missing
  let slug = data.slug || path.basename(filePath).replace('.md', '');
  
  // Fix title to Title Case
  let title = data.title;
  if (!title || title === 'undefined' || title === title.toLowerCase()) {
    // Try to extract from filename
    title = slug
      .replace(/-/g, ' ')
      .replace(/\.md$/, '');
  }
  title = toTitleCase(title);
  
  // Fix description
  let description = data.description || '';
  if (description === 'undefined' || !description) {
    description = `Roials Alpha intelligence on agentic infrastructure and liquidity engineering.`;
  }
  // Remove brand contamination
  description = description.replace(/Alpha Architect/gi, 'Roials Alpha');
  
  // Fix date
  let date = data.date || new Date().toISOString().split('T')[0];
  if (date === 'undefined') {
    date = new Date().toISOString().split('T')[0];
  }
  
  // Fix content headers
  let fixedContent = fixHeaders(content);
  
  // Ensure last heading is Sammanfattning
  if (!fixedContent.includes('## Sammanfattning') && !fixedContent.includes('## Sammanfattning')) {
    // Find last ## heading and add Sammanfattning after
    const lastHeadingMatch = fixedContent.match(/^## .+$/gm);
    if (lastHeadingMatch) {
      const lastHeading = lastHeadingMatch[lastHeadingMatch.length - 1];
      // Don't add if it's already Sammanfattning or similar
      if (!lastHeading.toLowerCase().includes('sammanfattning')) {
        fixedContent += '\n\n## Sammanfattning\n\nMarknaden belönar de som agerar före consensus. Roials Alpha bygger den infrastrukturen nu.';
      }
    }
  }
  
  const newFrontmatter = {
    title,
    description,
    date,
    author: 'Jonas Hyltén',
    slug
  };
  
  const newContent = matter.stringify(fixedContent, newFrontmatter);
  
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Fixed: ${path.basename(filePath)}`);
  console.log(`   Title: "${title}"`);
  return true;
}

function main() {
  console.log('Fixing Roials Alpha articles...\n');
  
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  let fixed = 0;
  
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    if (fixArticle(filePath)) {
      fixed++;
    }
  }
  
  console.log(`\n✅ Fixed ${fixed} articles`);
}

main();
