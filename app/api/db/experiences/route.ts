import { NextResponse } from 'next/server';
import { getExperiences } from '@/app/lib/database';

export async function GET() {
  try {
    const experiences = await getExperiences();
    return NextResponse.json({ experiences });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load experiences' }, { status: 500 });
  }
}
