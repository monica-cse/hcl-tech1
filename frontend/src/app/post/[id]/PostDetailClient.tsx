"use client";

import { useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

type AnalysisResult = {
  wordCount: number;
  sentiment: string;
};

export default function PostDetailClient({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "", // if needed
        },
        body: JSON.stringify({ text: post.body }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded"
      />

      <p className="text-gray-700">{post.body}</p>

      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isLoading ? "Analyzing..." : "Run Analysis"}
      </button>

      {analysis && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <p><strong>Word Count:</strong> {analysis.wordCount}</p>
          <p><strong>Sentiment:</strong> {analysis.sentiment}</p>
        </div>
      )}
    </div>
  );
}
