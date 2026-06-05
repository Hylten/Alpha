export interface IntelligenceArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

const ACRONYMS: [RegExp, string][] = [
  [/\bAi\b/g, 'AI'],
  [/\bGtm\b/g, 'GTM'],
  [/\bAbl\b/g, 'ABL'],
  [/\bHnw\b/g, 'HNW'],
  [/\bUhnw\b/g, 'UHNW'],
  [/\bPe\b/g, 'PE'],
  [/\bLlms?\b/gi, 'LLM'],
];

function polishText(value: string): string {
  let text = value.replace(/>-\s*/g, '').trim();
  for (const [pattern, replacement] of ACRONYMS) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractH1(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? polishText(match[1].trim()) : null;
}

function extractDescription(content: string): string {
  const paragraphs = content
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 50 && !p.startsWith('#'));

  if (paragraphs.length === 0) return '';

  let description = paragraphs[0]
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/\n/g, ' ')
    .trim();

  description = polishText(description);
  if (description.length > 200) {
    description = `${description.substring(0, 197)}...`;
  }
  return description;
}

function normalizeDate(value: unknown): string {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toISOString().split('T')[0];
}

/** Browser-safe frontmatter parser (no gray-matter / eval). */
export function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const lines = match[1].split('\n');
  const data: Record<string, string> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const keyMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) {
      i++;
      continue;
    }

    const key = keyMatch[1];
    let value = keyMatch[2].trim();

    if (value === '>-' || value === '>' || value === '|-' || value === '|') {
      const parts: string[] = [];
      i++;
      while (i < lines.length && !/^[a-zA-Z0-9_-]+:\s/.test(lines[i])) {
        if (lines[i].trim()) parts.push(lines[i].trim());
        i++;
      }
      value = parts.join(' ').trim();
    } else {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      i++;
    }

    if (!data[key]) {
      data[key] = polishText(value);
    }
  }

  return { data, content: match[2] };
}

export function resolveArticleMeta(
  rawMarkdown: string,
  filepath?: string
): { meta: IntelligenceArticleMeta; content: string } {
  const { data, content } = parseFrontmatter(rawMarkdown);
  const fileSlug = filepath?.split('/').pop()?.replace('.md', '') ?? '';

  const slug = polishText(String(data.slug || fileSlug || '').trim()) || fileSlug;
  const h1 = extractH1(content);

  let title = polishText(String(data.title || '').trim());
  if (!title || title.length < 3) {
    title = h1 || titleFromSlug(slug);
  }

  let description = polishText(String(data.description || '').trim());
  const genericDescription =
    description === 'Roials Alpha intelligence on agentic infrastructure and liquidity engineering.';
  if (!description || description.length < 30 || genericDescription) {
    description = extractDescription(content) || description;
  }

  let date = normalizeDate(data.date);
  if (!date) {
    date = '2026-03-01';
  }

  const author = polishText(String(data.author || 'Roials Alpha').trim()) || 'Roials Alpha';

  return {
    meta: { slug, title, description, date, author },
    content,
  };
}
