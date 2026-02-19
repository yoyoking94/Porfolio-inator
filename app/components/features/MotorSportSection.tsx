'use client';

import { useEffect, useState } from 'react';

interface MotorsportArticle {
    title: string;
    url: string;
    summary: string;
    image_url: string;
    published_at: string;
    news_site: string;
}

interface MotorsportData {
    f1: MotorsportArticle[];
    wrc: MotorsportArticle[];
    motogp: MotorsportArticle[];
    porsche: MotorsportArticle[];
    endurance: MotorsportArticle[];
}

const TABS: { key: keyof MotorsportData; label: string }[] = [
    { key: 'f1', label: 'Formula 1' },
    { key: 'wrc', label: 'WRC' },
    { key: 'motogp', label: 'MotoGP' },
    { key: 'porsche', label: 'Porsche Cup' },
    { key: 'endurance', label: 'Endurance' },
];

export default function MotorSportSection() {
    const [data, setData] = useState<MotorsportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<keyof MotorsportData>('f1');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch('/api/motorsports');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (!cancelled) setData(json);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur inconnue');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const articles = data?.[activeTab] ?? [];

    if (loading) return <p className="text-pixel-xs">Chargement des articles...</p>;
    if (error) return <p className="text-pixel-xs text-red-500">Erreur : {error}</p>;

    return (
        <div className="space-y-2 h-full flex flex-col">

            {/* Header */}
            <div className="border-b-2 border-black pb-2">
                <p className="text-pixel-xs font-bold">Motorsport.com — Derniers articles</p>
            </div>

            {/* Onglets */}
            <div className="flex flex-wrap border-b-2 border-black">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1 text-pixel-xs border-r-2 border-black transition-colors cursor-none hoverable
                            ${activeTab === tab.key
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-gray-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Liste des articles */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                {articles.length === 0 && (
                    <p className="text-pixel-xs text-gray-500">Aucun article disponible.</p>
                )}
                {articles.map((article, index) => (
                    <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 border-2 border-black p-2 hover:bg-gray-100 transition-colors group block cursor-none hoverable"
                    >
                        {/* Miniature */}
                        {article.image_url
                            ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    width={80}
                                    height={60}
                                    className="object-cover border border-black flex-shrink-0 grayscale transition-all duration-300"
                                />
                            )
                            : (
                                <div className="w-20 h-14 bg-black flex-shrink-0" />
                            )
                        }

                        {/* Contenu */}
                        <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-pixel-xs font-bold leading-tight line-clamp-2 group-hover:underline">
                                {article.title}
                            </p>
                            <p className="text-[9px] text-gray-500">
                                {article.news_site}
                                {article.published_at && ` — ${new Date(article.published_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}`}
                            </p>
                            <p className="text-[9px] text-gray-600 line-clamp-2">{article.summary}</p>
                        </div>

                        {/* Fleche externe */}
                        <span className="text-pixel-xs text-gray-400 flex-shrink-0 self-center group-hover:text-black">
                            &rarr;
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}
