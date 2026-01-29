import type { NextApiRequest, NextApiResponse } from 'next';
import { getProfile } from '@/app/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const profil = await getProfile();
    return res.status(200).json({ profil });
  } catch (error) {
    console.error('GET /api/profilRoute error:', error);
    return res.status(500).json({ error: 'Failed to load profil' });
  }
}

