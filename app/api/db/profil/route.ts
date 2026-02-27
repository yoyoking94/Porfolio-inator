import { NextResponse } from 'next/server';
import { getProfile } from '@/app/lib/database';

export async function GET() {
    try {
        const profil = await getProfile();
        return NextResponse.json({ profil });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to load profil' }, { status: 500 });
    }
}
