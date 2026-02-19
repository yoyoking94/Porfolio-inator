import { NextResponse } from 'next/server';

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

export async function GET() {
    try {
        const res = await fetch(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true&format=json`,
            { next: { revalidate: 3600 } } // cache 1h
        );
        if (!res.ok) throw new Error(`Steam API HTTP ${res.status}`);
        const data = await res.json();

        // Trier par heures de jeu décroissantes
        const games = (data.response?.games || []).sort(
            (a: { playtime_forever: number }, b: { playtime_forever: number }) =>
                b.playtime_forever - a.playtime_forever
        );

        return NextResponse.json({ games });
    } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur inconnue' }, { status: 500 });
    }
}
