import { NextResponse } from 'next/server';
import type { GitHubRepo, ReadmeContent } from '@/app/types';

const FEATURED_REPO_NAMES = [
    'Finance-inator',
    'Fitness-inator',
    'Password-inator-2',
    'Porfolio-inator',
    'Diet-inator',
];

const README_SECTION_MAP: Record<keyof ReadmeContent, string[]> = {
    presentation: ['présentation', 'presentation'],
    objectifs: ['objectifs', 'contexte', 'enjeux'],
    etapes: ['étapes', 'etapes'],
    acteurs: ['acteurs', 'interactions'],
    resultats: ['résultats', 'resultats'],
    lendemains: ['lendemains'],
    regard_critique: ['regard critique', 'regard'],
};

// Parse le contenu markdown en sections
function parseReadme(rawMarkdown: string): ReadmeContent {
    const result: ReadmeContent = {
        presentation: null,
        objectifs: null,
        etapes: null,
        acteurs: null,
        resultats: null,
        lendemains: null,
        regard_critique: null,
    };

    // Découpe par titres H2
    const sectionRegex = /^##\s+(.+)$/gm;
    const matches = [...rawMarkdown.matchAll(sectionRegex)];

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const sectionTitle = match[1].toLowerCase().trim();
        const sectionStart = (match.index ?? 0) + match[0].length;
        const sectionEnd = matches[i + 1]?.index ?? rawMarkdown.length;
        const sectionContent = rawMarkdown.slice(sectionStart, sectionEnd).trim();

        // Cherche quelle clé correspond à ce titre
        for (const [key, keywords] of Object.entries(README_SECTION_MAP)) {
            if (keywords.some((keyword) => sectionTitle.includes(keyword))) {
                result[key as keyof ReadmeContent] = sectionContent || null;
                break;
            }
        }
    }

    return result;
}

async function fetchReadme(
    username: string,
    repoName: string,
    token: string
): Promise<ReadmeContent | null> {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/readme`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        // Le contenu est en base64
        const rawMarkdown = Buffer.from(data.content, 'base64').toString('utf-8');
        return parseReadme(rawMarkdown);
    } catch {
        return null;
    }
}

export async function GET() {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

    if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
        return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 });
    }

    try {
        // Récupère tous les repos publics
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const allRepos: GitHubRepo[] = await response.json();

        const filteredRepos = allRepos.filter(
            (repo) =>
                !repo.fork &&
                repo.name !== GITHUB_USERNAME &&
                repo.name !== '.github'
        );

        // Récupère les READMEs des 5 repos featured en parallèle
        const reposWithReadme = await Promise.all(
            filteredRepos.map(async (repo) => {
                const isFeatured = FEATURED_REPO_NAMES.some(
                    (featuredName) =>
                        featuredName.toLowerCase() === repo.name.toLowerCase()
                );

                if (!isFeatured) {
                    return { ...repo, readme: null };
                }

                const readme = await fetchReadme(GITHUB_USERNAME, repo.name, GITHUB_TOKEN);
                return { ...repo, readme };
            })
        );

        return NextResponse.json(reposWithReadme);
    } catch (error) {
        console.error('Erreur API GitHub:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des projets' }, { status: 500 });
    }
}

export const revalidate = 3600;
