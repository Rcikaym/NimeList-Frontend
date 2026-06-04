import { NextApiRequest, NextApiResponse } from "next";
const api = process.env.NEXT_PUBLIC_API_URL;
export default async function handler(req : NextApiRequest, res : NextApiResponse ) {
    if (req.method === 'POST') {
      const { username, password, email } = req.body;
  
      const response = await fetch(`${api}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });
  
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  