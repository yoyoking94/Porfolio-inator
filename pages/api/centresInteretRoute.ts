import type { NextApiRequest, NextApiResponse } from 'next';
import { getCentresInteret } from '@/app/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const centresInteret = await getCentresInteret();
    return res.status(200).json({ centresInteret });
  } catch (error) {
    console.error("GET /api/centresInteretRoute error:", error);
    return res.status(500).json({ error: "Failed to load centres d'interet" });
  }
}

