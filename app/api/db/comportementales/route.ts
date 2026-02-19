import { NextResponse } from 'next/server';
import { getCompetencesComportementales } from '@/app/lib/db';

export async function GET() {
  try {
    const competencesComportementales = await getCompetencesComportementales();
    return NextResponse.json({ competencesComportementales });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load competences comportementales' }, { status: 500 });
  }
}
