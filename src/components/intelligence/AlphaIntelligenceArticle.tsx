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

            <div className="article-content" style={{ color: 'rgba(229, 231, 235, 0.7)', fontSize: '1rem', fontWeight: 300 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>

            <style>{`
                .article-content { line-height: 2.2; }
                .article-content p { margin-bottom: 3.5rem; }
                .article-content h2 { font-family: serif; font-size: 2.2rem; margin-top: 6rem; margin-bottom: 3rem; color: #fff; line-height: 1.3; }
                .article-content h3 { font-family: serif; font-size: 1.6rem; margin-top: 4.5rem; margin-bottom: 2.5rem; color: #fff; }
                .article-content ul, .article-content ol { margin-bottom: 3.5rem; padding-left: 2rem; }
                .article-content li { margin-bottom: 1.5rem; }
                .article-content hr { border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 6rem 0; }
                .article-content strong { color: #fff; font-weight: 500; }
                .article-content a { color: #8a6d3b; text-decoration: underline; }
            `}</style>

            <footer className="mt-16 text-center">
                <p className="font-mono text-[9px] text-gray-600 tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} Roials Capital Intelligence. All rights reserved.
                </p>
            </footer>
        </article>
    );
};
