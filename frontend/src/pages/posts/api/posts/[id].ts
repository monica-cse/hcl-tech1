import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const postId = parseInt(req.query.id as string);

  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    res.json(post);
  } else if (req.method === 'PUT') {
    const data = JSON.parse(req.body);
    const updated = await prisma.post.update({
      where: { id: postId },
      data: { title: data.title }
    });
    res.json(updated);
  }
}
