'use client';

import { useEffect, useState, useMemo } from 'react';

interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    topics: string[];
    language: string | null;
    stargazers_count: number;
    homepage: string | null;
}

export default function ProjetsSection() {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('Tous');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('../../../api/github');
                if (!response.ok) throw new Error('Erreur lors de la récupération des projets');
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Langages uniques extraits dynamiquement depuis les repos
    const tabs = useMemo(() => {
        const langs = projects
            .map((p) => p.language)
            .filter((l): l is string => l !== null);
        return ['Tous', ...Array.from(new Set(langs))];
    }, [projects]);

    // Projets filtrés selon l'onglet actif
    const filtered = useMemo(() => {
        if (activeTab === 'Tous') return projects;
        return projects.filter((p) => p.language === activeTab);
    }, [projects, activeTab]);

    if (loading) return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Mes Projets</h2>
            <div className="flex items-center justify-center h-40">
                <p className="text-pixel-sm">Chargement des projets...</p>
            </div>
        </section>
    );

    if (error) return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Mes Projets</h2>
            <p className="text-pixel-xs text-red-600">Erreur : {error}</p>
        </section>
    );

    if (projects.length === 0) return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Mes Projets</h2>
            <p className="text-pixel-xs text-gray-600">Aucun projet disponible pour le moment.</p>
        </section>
    );

    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Mes Projets</h2>

            {/* ── Onglets langages ── */}
            <div className="flex flex-wrap border-b-2 border-black">
                {tabs.map((tab) => (
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
                        {/* Compteur de projets par onglet */}
                        <span className={`ml-1 text-[9px] ${activeTab === tab ? 'text-gray-300' : 'text-gray-500'}`}>
                            ({tab === 'Tous' ? projects.length : projects.filter((p) => p.language === tab).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Liste filtrée ── */}
            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
                {filtered.length === 0 && (
                    <p className="text-pixel-xs text-gray-600">Aucun projet dans cette catégorie.</p>
                )}
                {filtered.map((project) => (
                    <div
                        key={project.id}
                        className="border-2 border-black p-4 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-pixel-sm font-bold">{project.name}</h3>
                            {project.stargazers_count > 0 && (
                                <span className="text-pixel-xs">⭐ {project.stargazers_count}</span>
                            )}
                        </div>

                        <p className="text-pixel-xs mb-2 text-gray-700">
                            {project.description || 'Pas de description'}
                        </p>

                        {project.topics && project.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {project.topics.slice(0, 5).map((topic, i) => (
                                    <span key={i} className="bg-black text-white px-2 py-1 text-pixel-xs">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        )}

                        {project.language && (
                            <p className="text-pixel-xs mb-2">
                                <strong>Langage :</strong> {project.language}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <a
                                href={project.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pixel-xs underline cursor-none hoverable"
                            >
                                Voir sur GitHub →
                            </a>
                            {project.homepage && (
                                <a
                                    href={project.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pixel-xs underline cursor-none hoverable text-blue-600"
                                >
                                    Demo live →
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
