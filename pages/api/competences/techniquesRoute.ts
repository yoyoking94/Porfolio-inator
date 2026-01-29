import type { NextApiRequest, NextApiResponse } from 'next';
import { getCompetencesTechniques } from '@/app/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const competencesTechniques = await getCompetencesTechniques();
    return res.status(200).json({ competencesTechniques });
  } catch (error) {
    console.error('GET /api/competences/techniquesRoute error:', error);
    return res.status(500).json({ error: 'Failed to load competences techniques' });
  }
}

