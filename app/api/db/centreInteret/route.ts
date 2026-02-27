import { NextResponse } from 'next/server';
import { getCentresInteret } from '@/app/lib/database';

export async function GET() {
  try {
    const centresInteret = await getCentresInteret();
    return NextResponse.json({ centresInteret });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load centres interet' }, { status: 500 });
  }
}
