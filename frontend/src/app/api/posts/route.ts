import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "mysecretkey123";

// GET all DB posts
export async function GET(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (key !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST new post
export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (key !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, body, sentiment } = await req.json();
  if (!title || !body || !sentiment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: { title, body, sentiment },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
