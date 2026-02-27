import { NextResponse } from 'next/server';
import { getLangues } from '@/app/lib/database';

export async function GET() {
  try {
    const langues = await getLangues();
    return NextResponse.json({ langues });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load langues' }, { status: 500 });
  }
}
