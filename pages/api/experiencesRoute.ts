import type { NextApiRequest, NextApiResponse } from 'next';
import { getExperiences } from '@/app/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const experiences = await getExperiences();
    return res.status(200).json({ experiences });
  } catch (error) {
    console.error('GET /api/experiencesRoute error:', error);
    return res.status(500).json({ error: 'Failed to load experiences' });
  }
}

