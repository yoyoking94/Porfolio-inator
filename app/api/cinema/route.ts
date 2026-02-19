import { NextResponse } from 'next/server';

const TMDB_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const GENRES: Record<string, number> = {
    action: 28,
    scifi: 878,
    thriller: 53,
    animation: 16,
};

async function fetchMovies(endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams({
        api_key: TMDB_KEY!,
        language: 'fr-FR',
        region: 'FR',
        ...params,
    });

    const res = await fetch(`${BASE_URL}${endpoint}?${query}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`TMDB HTTP ${res.status}`);
    const data = await res.json();
    return data.results?.slice(0, 12) ?? [];
}

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const inThreeMonths = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];

        const [upcoming, action, scifi, thriller, animation] = await Promise.all([
            fetchMovies('/movie/upcoming'),
            fetchMovies('/discover/movie', {
                with_genres: String(GENRES.action),
                'primary_release_date.gte': today,
                'primary_release_date.lte': inThreeMonths,
                sort_by: 'popularity.desc',
            }),
            fetchMovies('/discover/movie', {
                with_genres: String(GENRES.scifi),
                'primary_release_date.gte': today,
                'primary_release_date.lte': inThreeMonths,
                sort_by: 'popularity.desc',
            }),
            fetchMovies('/discover/movie', {
                with_genres: String(GENRES.thriller),
                'primary_release_date.gte': today,
                'primary_release_date.lte': inThreeMonths,
                sort_by: 'popularity.desc',
            }),
            fetchMovies('/discover/movie', {
                with_genres: String(GENRES.animation),
                'primary_release_date.gte': today,
                'primary_release_date.lte': inThreeMonths,
                sort_by: 'popularity.desc',
            }),
        ]);

        return NextResponse.json({ upcoming, action, scifi, thriller, animation });
    } catch (e) {
        console.error('[Films] Error:', e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Erreur inconnue' },
            { status: 500 }
        );
    }
}
