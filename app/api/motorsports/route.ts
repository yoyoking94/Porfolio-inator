import { NextResponse } from 'next/server';

const RSS_FEEDS: Record<string, string> = {
    f1: 'https://fr.motorsport.com/rss/f1/news/',
    wrc: 'https://fr.motorsport.com/rss/wrc/news/',
    motogp: 'https://fr.motorsport.com/rss/motogp/news/',
    porsche: 'https://fr.motorsport.com/rss/porsche-supercup/news/',
    endurance: 'https://fr.motorsport.com/rss/le-mans/news/',
};

async function parseRSS(url: string) {
    try {
        const res = await fetch(url, {
            next: { revalidate: 3600 },
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Portfolio/1.0)' },
        });

        if (!res.ok) {
            console.error(`[RSS] HTTP ${res.status} for ${url}`);
            return [];
        }

        const xml = await res.text();

        if (!xml.includes('<item>')) {
            console.error(`[RSS] No items found in ${url}`);
            return [];
        }

        const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

        return items.slice(0, 10).map((item) => {
            const get = (tag: string) => {
                const match = item.match(
                    new RegExp(
                        `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`
                    )
                );
                return match ? (match[1] || match[2] || '').trim() : '';
            };

            const enclosure = item.match(/<enclosure[^>]+url="([^"]+)"/);
            const mediaContent = item.match(/<media:content[^>]+url="([^"]+)"/);

            return {
                title: get('title'),
                url: get('link'),
                summary: get('description').replace(/<[^>]+>/g, '').slice(0, 200),
                image_url: enclosure?.[1] || mediaContent?.[1] || '',
                published_at: get('pubDate'),
                news_site: 'Motorsport.com',
            };
        });
    } catch (e) {
        console.error(`[RSS] Error parsing ${url}:`, e);
        return [];
    }
}

export async function GET() {
    try {
        const [f1, wrc, motogp, porsche, endurance] = await Promise.all([
            parseRSS(RSS_FEEDS.f1),
            parseRSS(RSS_FEEDS.wrc),
            parseRSS(RSS_FEEDS.motogp),
            parseRSS(RSS_FEEDS.porsche),
            parseRSS(RSS_FEEDS.endurance),
        ]);

        console.log('[Motorsport]', { f1: f1.length, wrc: wrc.length, motogp: motogp.length, porsche: porsche.length, endurance: endurance.length });

        return NextResponse.json({ f1, wrc, motogp, porsche, endurance });
    } catch (e) {
        console.error('[Motorsport] Global error:', e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Erreur inconnue' },
            { status: 500 }
        );
    }
}
