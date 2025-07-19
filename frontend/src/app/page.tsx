"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number | string;
  title: string;
  body: string;
  sentiment?: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        // Local DB posts
        const localRes = await fetch("/api/posts", {
          headers: { "x-api-key": "mysecretkey123" },
        });
        const localPosts = await localRes.json();

        // External mock API
        const externalRes = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const externalPosts = await externalRes.json();

        // Combine them
        setPosts([...localPosts, ...externalPosts]);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleCreate = async () => {
    if (!title || !body) return;

    const tempId = "temp-" + Date.now();
    const newPost: Post = { id: tempId, title, body };

    // Optimistically add to UI
    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setBody("");

    // Send to backend
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "mysecretkey123",
      },
      body: JSON.stringify({ title, body, sentiment: "neutral" }),
    });

    if (res.ok) {
      const savedPost = await res.json();
      // Replace temp post with real post
      setPosts((prev) =>
        prev.map((p) => (p.id === tempId ? savedPost : p))
      );
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Posts</h1>

      <div className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 w-full rounded"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          className="border p-2 w-full rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border p-3 rounded">
              <h2 className="font-semibold">{post.title}</h2>
              <p>{post.body}</p>
              {post.sentiment && (
                <span className="text-sm text-gray-500">Sentiment: {post.sentiment}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
