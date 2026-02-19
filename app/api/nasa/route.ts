import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

export async function GET() {
    try {
        // Fetch articles sur la Lune et Mars en parallèle
        const [moonRes, marsRes] = await Promise.all([
            fetch(`${BASE_URL}/articles/?search=moon&limit=10&ordering=-published_at`, {
                next: { revalidate: 3600 }
            }),
            fetch(`${BASE_URL}/articles/?search=mars&limit=10&ordering=-published_at`, {
                next: { revalidate: 3600 }
            }),
        ]);

        if (!moonRes.ok) throw new Error(`Moon HTTP ${moonRes.status}`);
        if (!marsRes.ok) throw new Error(`Mars HTTP ${marsRes.status}`);

        const moonData = await moonRes.json();
        const marsData = await marsRes.json();

        return NextResponse.json({
            moon: moonData.results,
            mars: marsData.results,
        });
    } catch (e) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Erreur inconnue' },
            { status: 500 }
        );
    }
}
