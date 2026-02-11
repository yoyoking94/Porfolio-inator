'use client';

import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('../../../api/github');

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des projets');
                }

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

    if (loading) {
        return (
            <section className="space-y-4">
                <h2 className="text-pixel-lg">Mes Projets</h2>
                <div className="flex items-center justify-center h-40">
                    <p className="text-pixel-sm">Chargement des projets...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="space-y-4">
                <h2 className="text-pixel-lg">Mes Projets</h2>
                <p className="text-pixel-xs text-red-600">Erreur : {error}</p>
            </section>
        );
    }

    if (projects.length === 0) {
        return (
            <section className="space-y-4">
                <h2 className="text-pixel-lg">Mes Projets</h2>
                <p className="text-pixel-xs text-gray-600">
                    Aucun projet disponible pour le moment.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Mes Projets</h2>
            <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
                {projects.map((project: GitHubRepo) => (
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
                                {project.topics.slice(0, 5).map((topic: string, i: number) => (
                                    <span
                                        key={i}
                                        className="bg-black text-white px-2 py-1 text-pixel-xs"
                                    >
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
