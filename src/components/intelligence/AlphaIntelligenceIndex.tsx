import React, { useState, useEffect } from 'react';

// Browser-safe frontmatter parser (no gray-matter / no Buffer needed)
function parseFrontmatter(raw: string) {
    const parts = raw.split(/---/);
    if (parts.length < 3) return { data: {} as Record<string, string>, content: raw };
    
    // Frontmatter is between the first and second '---'
    const frontmatter = parts[1];
    const content = parts.slice(2).join('---').trim();
    const data: Record<string, string> = {};

    // Robust regex to extract metadata keys and values
    const regex = /([\w-]+):\s*(?:"([^"]*)"|'([^']*)'|([^ \n\r,]+))/g;
    let match;
    while ((match = regex.exec(frontmatter)) !== null) {
        const key = match[1];
        const value = match[2] || match[3] || match[4];
        if (key && !data[key]) {
            data[key] = value;
        }
    }
    
    return { data, content };
}

// Helper to parse the raw markdown files explicitly
const getPosts = () => {
    const postsGlob = import.meta.glob('../../../content/intelligence/*.md', { query: '?raw', eager: true });

    const posts = Object.entries(postsGlob).map(([filepath, content]) => {
        const rawMarkdown = (content as any).default;
        const { data } = parseFrontmatter(rawMarkdown);

        return {
            slug: data.slug || filepath.split('/').pop()?.replace('.md', ''),
            title: data.title || 'Untitled',
            description: data.description || '',
            date: data.date || '2026-03-01',
            author: data.author || 'Roials Alpha',
        };
    });

    return posts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
    });
};

export const AlphaIntelligenceIndex: React.FC = () => {
    const [posts, setPosts] = useState<ReturnType<typeof getPosts>>([]);

    useEffect(() => {
        setPosts(getPosts());

        document.title = 'Intelligence | Roials Alpha';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Proprietary intelligence on asset hardening, institutional migration, and the structural mechanics of Fund III+ expansions.');
        }
    }, []);

    return (
        <div className="pt-40 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen font-sans">
            <div className="mb-20 text-center md:text-left relative z-10">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                    <div className="w-2 h-2 bg-oldgold rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
                    <span className="font-mono text-[10px] tracking-[0.2em] font-medium text-gray-400 uppercase">Module Active</span>
                </div>

                <h1 className="font-serif text-5xl md:text-7xl text-platinum mb-8 tracking-tight">
                    System <span className="font-light italic text-gray-500">Intelligence</span>
                </h1>

                <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed tracking-wide border-l border-oldgold/30 pl-6 text-left mx-auto md:mx-0">
                    Proprietary intelligence on asset hardening, institutional migration, and the structural mechanics of Fund III+ expansions.
                </p>
            </div>

            <div className="space-y-6 relative z-10">
                {posts.map((post) => (
                    <article
                        key={post.slug}
                        className="group bg-obsidian p-8 border border-white/5 hover:border-oldgold/30 hover:bg-white/[0.02] transition-all duration-500 text-left"
                    >
                        <a href={`/Alpha/intelligence/${post.slug}`} className="block">
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                                <time className="text-[10px] tracking-widest text-gray-500 uppercase">
                                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </time>
                                <span className="text-[9px] tracking-widest text-oldgold/50 uppercase">
                                    {post.author}
                                </span>
                            </div>

                            <h2 className="font-serif text-2xl text-platinum group-hover:text-oldgold transition-colors duration-300 mb-4 tracking-tight">
                                {post.title}
                            </h2>

                            <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed tracking-wide mb-6 line-clamp-3">
                                {post.description}
                            </p>

                            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-white uppercase group-hover:text-oldgold transition-colors duration-300">
                                Execute Process
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </div>
                        </a>
                    </article>
                ))}

                {posts.length === 0 && (
                    <div className="flex flex-col items-center gap-8 py-20 relative z-10">
                        <div className="w-full text-center py-16 border border-white/5 bg-white/[0.01]">
                            <p className="text-[11px] text-gray-500 tracking-[0.1em] uppercase">Intelligence access is restricted to mandated partners.</p>
                            <p className="text-[10px] text-gray-600 tracking-wider mt-2">Public briefings are released periodically.</p>
                        </div>
                        <a
                            href="/Alpha/"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:bg-white/5 hover:border-white/20 text-[10px] tracking-[0.2em] text-gray-400 uppercase transition-all duration-300"
                        >
                            Return to Core
                        </a>
                    </div>
                )}
            </div>

            {/* Background decoration */}
            <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-oldgold/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        </div>
    );
};
