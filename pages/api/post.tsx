// pages/api/posts.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('http://localhost:3001/animes');
  const posts = await response.json();
  
  res.status(200).json(posts);
}
