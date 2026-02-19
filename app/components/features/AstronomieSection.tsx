'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SpaceArticle {
    id: number;
    title: string;
    url: string;           // ← lien vers le site source
    image_url: string;
    news_site: string;
    summary: string;
    published_at: string;
}

const TABS = ['Lune', 'Mars'] as const;
type Tab = typeof TABS[number];

export default function AstronomieSection() {
    const [moon, setMoon] = useState<SpaceArticle[]>([]);
    const [mars, setMars] = useState<SpaceArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('Lune');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch('/api/nasa');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!cancelled) {
                    setMoon(data.moon || []);
                    setMars(data.mars || []);
                }
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur inconnue');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const articles = activeTab === 'Lune' ? moon : mars;

    if (loading) return <p className="text-pixel-xs">Chargement des articles…</p>;
    if (error) return <p className="text-pixel-xs text-red-500">Erreur : {error}</p>;

    return (
        <div className="space-y-2 h-full flex flex-col">

            {/* Header */}
            <div className="border-b-2 border-black pb-2">
                <p className="text-pixel-xs font-bold">Spaceflight News — Derniers articles</p>
            </div>

            {/* Onglets */}
            <div className="flex border-b-2 border-black">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-pixel-xs border-r-2 border-black transition-colors cursor-none hoverable
                            ${activeTab === tab
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-gray-100'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Liste des articles */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                {articles.map((article) => (
                    // ← target="_blank" redirige vers le site source
                    <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 border-2 border-black p-2 hover:bg-gray-100 transition-colors group block"
                    >
                        {/* Miniature */}
                        {article.image_url
                            ? (
                                <Image
                                    src={article.image_url}
                                    alt={article.title}
                                    width={80}
                                    height={60}
                                    className="object-cover border border-black flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            )
                            : (
                                <div className="w-20 h-14 bg-black flex-shrink-0 flex items-center justify-center">
                                    <span className="text-white text-xl">
                                        {activeTab === 'Lune' ? 'lune' : 'mars'}
                                    </span>
                                </div>
                            )
                        }

                        {/* Contenu */}
                        <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-pixel-xs font-bold leading-tight line-clamp-2 group-hover:underline">
                                {article.title}
                            </p>
                            <p className="text-[9px] text-gray-500">
                                {article.news_site} — {new Date(article.published_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>
                            <p className="text-[9px] text-gray-600 line-clamp-2">{article.summary}</p>
                        </div>

                        {/* Flèche externe */}
                        <span className="text-pixel-xs text-gray-400 flex-shrink-0 self-center group-hover:text-black">↗</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
