import type { NextApiRequest, NextApiResponse } from 'next';
import { getFormations } from '@/app/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const formations = await getFormations();
    return res.status(200).json({ formations });
  } catch (error) {
    console.error('GET /api/formationsRoute error:', error);
    return res.status(500).json({ error: 'Failed to load formations' });
  }
}

