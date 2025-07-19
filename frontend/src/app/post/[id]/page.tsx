"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function PostPage() {
  const params = useParams();
  const id = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [wordCount, setWordCount] = useState<number | null>(null); // 👈 Added for word count

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      const data = await res.json();
      setPost(data);
      setTitle(data.title);
      setBody(data.body);
      setLoading(false);
    }

    if (id) fetchPost();
  }, [id]);

  // 👇 Analyze the body using C++ API once post is fetched
  useEffect(() => {
    if (post) {
      fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: post.body }),
      })
        .then((res) => res.json())
        .then((data) => setWordCount(data.word_count))
        .catch((err) => console.error("Analysis failed:", err));
    }
  }, [post]);

  async function handleSave() {
    if (!id) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY || "your-secret-api-key"}`,
        },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      const updated = await res.json();
      setPost(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Post #{post?.id}</h1>

      {wordCount !== null && (
        <p className="text-gray-600 mb-4">📝 Word Count (analyzed by C++ backend): {wordCount}</p>
      )}

      <label className="block mb-2 text-sm font-medium">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2 text-sm font-medium">Body</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-2 mb-4 border rounded h-40"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {saved && <p className="text-green-600 mt-2">Saved successfully!</p>}
    </main>
  );
}
