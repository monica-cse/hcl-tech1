'use client';

import { useState } from 'react';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setSentiment(data.sentiment);
    } catch (err) {
      console.error('Error analyzing text:', err);
      setSentiment('Error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Text Sentiment Analyzer</h1>
      <textarea
        className="w-full border border-gray-300 p-4 rounded mb-4"
        rows={5}
        placeholder="Type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {sentiment && (
        <div className="mt-4">
          <strong>Sentiment:</strong> {sentiment}
        </div>
      )}
    </div>
  );
}
