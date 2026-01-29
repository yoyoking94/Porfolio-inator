import type { NextApiRequest, NextApiResponse } from 'next';
import { getLangues } from '@/app/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const langues = await getLangues();
    return res.status(200).json({ langues });
  } catch (error) {
    console.error('GET /api/languesRoute error:', error);
    return res.status(500).json({ error: 'Failed to load langues' });
  }
}

