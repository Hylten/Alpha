const fs = require('fs');
const path = require('path');
const dir = './content/intelligence/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

let changed = 0;
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Fix indentations (4 spaces -> bullet point '- ')
  content = content.replace(/^    ([A-Za-z0-9][^\n]+)/gm, '- $1');

  // 2. Remove Technical Mandate block entirely
  content = content.replace(/#+\s+Technical Mandate[\s\S]*?(?=(#+\s+Summary)|^Summary)/gim, '');
  content = content.replace(/^.*500K SEK.*$/gmi, '');

  // 3. Fix Summary heading
  content = content.replace(/^Summary\s*$/gm, '## Summary');

  // 4. Remove ← Previous and Next → lines
  content = content.replace(/^← Previous.*$/gm, '');
  content = content.replace(/^Next →.*$/gm, '');

  // 5. Restore H1 title if it's completely missing
  const titleMatch = content.match(/^title:\s*[\"'](.*?)[\"']/m);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    const parts = content.split(/^---\s*$/m);
    if (parts.length >= 3) {
      // parts[0] = "", parts[1] = frontmatter, parts[2] = body
      let body = parts.slice(2).join('---');
      if (body.trim() && body.indexOf('# ') === -1) {
        body = '\n# ' + title + '\n' + body;
        content = parts[0] + '---' + parts[1] + '---' + body;
      }
    }
  }

  // Clean multiple empty lines
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changed++;
  }
});
console.log('Fixed markdown layout in ' + changed + ' files.');
