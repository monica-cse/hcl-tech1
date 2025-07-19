import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "mysecretkey123";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(context.params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  const { title, body } = await req.json();

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, body },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
