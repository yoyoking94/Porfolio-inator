import { NextResponse } from 'next/server';
import { getCompetencesTechniques } from '@/app/lib/db';

export async function GET() {
  try {
    const competencesTechniques = await getCompetencesTechniques();
    return NextResponse.json({ competencesTechniques });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load competences techniques' }, { status: 500 });
  }
}
