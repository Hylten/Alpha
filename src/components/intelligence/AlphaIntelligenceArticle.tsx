import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Browser-safe frontmatter parser
function parseFrontmatter(raw: string) {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { data: {} as Record<string, string>, content: raw };
    const frontmatter = match[1];
    const content = match[2];
    const data: Record<string, string> = {};
    for (const line of frontmatter.split('\n')) {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;
        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        data[key] = value;
    }
    return { data, content };
}

interface AlphaIntelligenceArticleProps {
    slug: string;
}

export const AlphaIntelligenceArticle: React.FC<AlphaIntelligenceArticleProps> = ({ slug }) => {
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState<any>({});
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const postsGlob = import.meta.glob('../../../content/intelligence/*.md', { query: '?raw', eager: true });

                let foundPost = null;

                for (const [filepath, fileContent] of Object.entries(postsGlob)) {
                    const rawMarkdown = (fileContent as any).default;
                    const { data, content: markdownBody } = parseFrontmatter(rawMarkdown);

                    const fileSlug = data.slug || filepath.split('/').pop()?.replace('.md', '');

                    if (fileSlug === slug) {
                        foundPost = { meta: data, body: markdownBody };
                        break;
                    }
                }

                if (foundPost) {
                    setContent(foundPost.body);
                    setMeta(foundPost.meta);

                    if (foundPost.meta.title) {
                        document.title = `${foundPost.meta.title} | Roials Alpha Intelligence`;
                    }
                    if (foundPost.meta.description) {
                        const metaDescription = document.querySelector('meta[name="description"]');
                        if (metaDescription) {
                            metaDescription.setAttribute('content', foundPost.meta.description);
                        }
                    }
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Failed to load article:", e);
                setError(true);
            }
        };

        loadContent();
        window.scrollTo(0, 0);
    }, [slug]);

    if (error) {
        return (
            <div className="pt-32 pb-24 px-6 text-center min-h-screen flex flex-col items-center justify-center">
                <h1 className="font-serif text-2xl text-platinum tracking-widest mb-4">Report Not Found</h1>
                <a href="/intelligence" className="text-oldgold font-mono tracking-widest uppercase text-[10px] hover:text-white transition-colors">
                    Return to Intelligence
                </a>
            </div>
        );
    }

    if (!content) {
        return <div className="min-h-screen bg-obsidian"></div>; // Loading state
    }

    return (
        <article className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto min-h-screen relative z-10">
            <div className="flex flex-wrap items-center gap-6 mb-12">
                <a
                    href="/Alpha/intelligence/"
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-500 hover:text-oldgold uppercase transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Intelligence
                </a>
                <span className="text-gray-800">|</span>
                <a
                    href="/Alpha/"
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-500 hover:text-oldgold uppercase transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Alpha Home
                </a>
            </div>

            <header className="mb-16 border-b border-white/10 pb-12">
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-8">
                    <time className="font-mono text-[9px] text-oldgold/70 uppercase tracking-[0.2em]">
                        {meta.date ? new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </time>
                    <span className="hidden md:inline text-white/20 px-2">•</span>
                    <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.2em]">
                        {meta.author || 'Roials Alpha'}
                    </span>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-platinum mb-8 leading-tight tracking-tight">
                    {meta.title}
                </h1>

                {meta.description && (
                    <p className="font-sans text-lg text-platinum/70 leading-relaxed font-light border-l border-oldgold/30 pl-6">
                        {meta.description}
                    </p>
                )}
            </header>

            <div className="prose prose-invert prose-p:font-sans prose-p:font-light prose-p:text-sm prose-p:leading-relaxed prose-p:tracking-wide prose-p:text-gray-400 prose-headings:font-serif prose-headings:font-normal prose-headings:text-platinum prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h3:text-xl prose-h3:mt-8 prose-a:text-oldgold prose-strong:font-medium prose-strong:text-platinum prose-ol:text-gray-400 prose-ul:text-gray-400 border-b border-white/10 pb-16">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>

            <footer className="mt-16 text-center">
                <p className="font-mono text-[9px] text-gray-600 tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} Roials Capital Intelligence. All rights reserved.
                </p>
            </footer>
        </article>
    );
};
