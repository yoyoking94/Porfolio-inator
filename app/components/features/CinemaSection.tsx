'use client';

import { useEffect, useState } from 'react';

interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}

interface FilmsData {
    upcoming: Movie[];
    action: Movie[];
    scifi: Movie[];
    thriller: Movie[];
    animation: Movie[];
}

const TABS: { key: keyof FilmsData; label: string }[] = [
    { key: 'upcoming', label: 'Prochaines sorties' },
    { key: 'action', label: 'Action' },
    { key: 'scifi', label: 'Science-Fiction' },
    { key: 'thriller', label: 'Thriller' },
    { key: 'animation', label: 'Animation' },
];

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w200';
const TMDB_MOVIE = 'https://www.themoviedb.org/movie';

export default function FilmsSection() {
    const [data, setData] = useState<FilmsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<keyof FilmsData>('upcoming');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch('/api/cinema');
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

    const movies = data?.[activeTab] ?? [];

    if (loading) return <p className="text-pixel-xs">Chargement des films...</p>;
    if (error) return <p className="text-pixel-xs text-red-500">Erreur : {error}</p>;

    return (
        <div className="space-y-2 h-full flex flex-col">

            {/* Header */}
            <div className="border-b-2 border-black pb-2">
                <p className="text-pixel-xs font-bold">TMDB — Prochaines sorties cinema</p>
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

            {/* Grille de films */}
            <div className="overflow-y-auto flex-1 pr-1">
                {movies.length === 0 && (
                    <p className="text-pixel-xs text-gray-500">Aucun film disponible.</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {movies.map((movie) => (
                        <a
                            key={movie.id}
                            href={`${TMDB_MOVIE}/${movie.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col border-2 border-black hover:bg-gray-100 transition-colors cursor-none hoverable"
                        >
                            {/* Affiche */}
                            {movie.poster_path
                                ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={`${TMDB_IMAGE}${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full object-cover grayscale transition-all duration-300"
                                        style={{ aspectRatio: '2/3', imageRendering: 'pixelated' }}
                                    />
                                )
                                : (
                                    <div
                                        className="w-full bg-black flex items-center justify-center"
                                        style={{ aspectRatio: '2/3' }}
                                    >
                                        <span className="text-white text-pixel-xs">N/A</span>
                                    </div>
                                )
                            }

                            {/* Infos */}
                            <div className="p-1.5 space-y-0.5">
                                <p className="text-[9px] font-bold leading-tight line-clamp-2 group-hover:underline">
                                    {movie.title}
                                </p>
                                <p className="text-[8px] text-gray-500">
                                    {movie.release_date
                                        ? new Date(movie.release_date).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                        })
                                        : 'Date inconnue'
                                    }
                                </p>
                                {movie.vote_average > 0 && (
                                    <p className="text-[8px] text-gray-500">
                                        {movie.vote_average.toFixed(1)} / 10
                                    </p>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
