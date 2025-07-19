// src/lib/mockApi.ts

export async function fetchMockPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Mock fetch failed");
  return res.json();
}
