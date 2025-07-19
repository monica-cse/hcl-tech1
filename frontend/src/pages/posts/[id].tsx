import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function PostEditPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!post) return;
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!post) return;
    await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      body: JSON.stringify(post),
      headers: { "Content-Type": "application/json" },
    });
    alert("Post updated");
  };

  if (!post) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <input
        className="text-xl border p-2 w-full mb-2"
        name="title"
        value={post.title}
        onChange={handleChange}
      />
      <textarea
        className="border p-2 w-full h-40"
        name="content"
        value={post.content}
        onChange={handleChange}
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
