'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
}

export default function SteamLibrary() {
    const [games, setGames] = useState<SteamGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch('/api/steam');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!cancelled) setGames(data.games || []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur inconnue');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const filtered = games.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatPlaytime = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        return `${Math.floor(minutes / 60)}h`;
    };

    if (loading) return <p className="text-pixel-xs">Chargement de la bibliothèque…</p>;
    if (error) return <p className="text-pixel-xs text-red-500">Erreur : {error}</p>;

    return (
        <div className="space-y-2 h-full flex flex-col">

            {/* Header stats */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <p className="text-pixel-xs font-bold">{games.length} jeux</p>
                <p className="text-pixel-xs text-gray-500">
                    {Math.floor(games.reduce((acc, g) => acc + g.playtime_forever, 0) / 60)}h jouées au total
                </p>
            </div>

            {/* Barre de recherche */}
            <input
                type="text"
                placeholder="Rechercher un jeu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-black px-2 py-1 text-pixel-xs outline-none focus:bg-gray-50"
            />

            {/* Liste des jeux */}
            <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                {filtered.length === 0 && (
                    <p className="text-pixel-xs text-gray-500">Aucun jeu trouvé.</p>
                )}
                {filtered.map((game) => (
                    <div
                        key={game.appid}
                        className="flex items-center gap-2 border border-black p-1.5 hover:bg-gray-100 transition-colors"
                    >
                        {game.img_icon_url
                            ? (
                                <Image
                                    src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                    alt={game.name}
                                    width={32}
                                    height={32}
                                    className="border border-black flex-shrink-0 grayscale"
                                    /* className="border border-black flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300" */
                                    style={{ imageRendering: 'pixelated' }}
                                />

                            )
                            : (
                                <div className="w-8 h-8 bg-black flex-shrink-0" />
                            )
                        }
                        <span className="text-pixel-xs flex-1 truncate">{game.name}</span>
                        <span className="text-pixel-xs text-gray-500 flex-shrink-0 ml-auto">
                            {formatPlaytime(game.playtime_forever)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
