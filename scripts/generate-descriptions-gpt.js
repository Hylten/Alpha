import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'intelligence');

async function callGPT5(prompt) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            max_tokens: 250,
            messages: [{ role: 'user', content: prompt }]
        });

        const options = {
            hostname: 'localhost',
            port: 8082,
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'sk-ant-dummy-key',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed.content[0].text);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function extractFirstParagraph(content) {
    const paragraphs = content
        .split('\n\n')
        .filter(p => {
            const t = p.trim();
            return t.length > 50 && 
                !t.startsWith('#') && 
                !t.startsWith('##') &&
                !t.startsWith('###') &&
                !t.startsWith('-');
        });
    return paragraphs[0] || '';
}

async function generateDescription(title, content, slug) {
    const firstPara = extractFirstParagraph(content);
    const lang = /[åäöÅÄÖ]/.test(firstPara) ? 'Swedish' : 'English';
    
    const prompt = `Generate ONE compelling 1-sentence description (max 200 chars) for "${title}" from Roials Alpha brand.
Article language: ${lang}
Article summary: ${firstPara.substring(0, 300)}
Write ONLY the description, nothing else.`;

    try {
        const description = await callGPT5(prompt);
        return description.trim().substring(0, 200);
    } catch (e) {
        console.error('GPT-5.1 error:', e.message);
        return null;
    }
}

async function main() {
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    
    let processed = 0;
    let skipped = 0;
    
    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(rawContent);
        
        // Skip if description is already good
        if (parsed.data.description && 
            parsed.data.description.length > 50 &&
            !parsed.data.description.includes('Roials Alpha intelligence') &&
            !parsed.data.description.includes('Insights on')) {
            skipped++;
            continue;
        }
        
        console.log(`Processing: ${file}`);
        
        const description = await generateDescription(
            parsed.data.title || file,
            parsed.content,
            file.replace('.md', '')
        );
        
        if (description) {
            parsed.data.description = description;
            fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
            console.log(`  -> "${description.substring(0, 60)}..."`);
            processed++;
            
            // Rate limit to avoid overwhelming the API
            await new Promise(r => setTimeout(r, 500));
        }
    }
    
    console.log(`\n✅ Processed: ${processed}`);
    console.log(`⏭️ Skipped: ${skipped}`);
}

main().catch(console.error);
