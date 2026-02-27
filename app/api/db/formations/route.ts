import { NextResponse } from 'next/server';
import { getFormations } from '@/app/lib/database';

export async function GET() {
  try {
    const formations = await getFormations();
    return NextResponse.json({ formations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load formations' }, { status: 500 });
  }
}
