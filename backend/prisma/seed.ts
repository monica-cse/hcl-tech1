import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  const posts = res.data.slice(0, 20); // limit to 20 for speed

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        body: post.body,
        sentiment: "neutral", // or set based on your logic
      },
    });
  }

  console.log("Seeding complete.");
}

main().finally(() => prisma.$disconnect());
