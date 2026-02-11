import { NextResponse } from 'next/server';

interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    topics: string[];
    language: string | null;
    stargazers_count: number;
    homepage: string | null;
    fork: boolean;
}

export async function GET() {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

    if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
        console.error('Variables d\'environnement GitHub manquantes');
        return NextResponse.json(
            { error: 'Configuration manquante' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data: GitHubRepo[] = await response.json();

        const filteredProjects = data.filter(
            (repo) =>
                !repo.fork &&
                repo.name !== GITHUB_USERNAME &&
                repo.name !== '.github'
        );

        return NextResponse.json(filteredProjects);
    } catch (error) {
        console.error('Erreur API GitHub:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des projets' },
            { status: 500 }
        );
    }
}

export const revalidate = 3600;
