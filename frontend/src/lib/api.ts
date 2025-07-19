// src/lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// --- Fetch all posts from local API ---
export async function fetchAllPosts() {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    headers: {
      "x-api-key": API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

// --- Fetch a single post by ID ---
export async function fetchPostById(id: string) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    headers: {
      "x-api-key": API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

// --- Update a post (PUT) ---
export async function updatePost(id: string, data: { title: string; body: string }) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update post");
  }

  return res.json();
}

// --- Optional: Create a new post ---
export async function createPost(data: { title: string; body: string; sentiment?: string }) {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create post");
  }

  return res.json();
}

// --- Analyze post body using C++ WebAssembly backend ---
export async function analyzePostBody(text: string) {
  const res = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error("C++ analysis failed");
  }

  return res.json(); // Expecting { wordCount: number, ... }
}
