'use client';

import { useState } from 'react';
import GeneratorForm from '@/components/GeneratorForm';
import { ContentDisplay } from '@/components/ContentDisplay';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ContentResponse, ContentRequest } from '@/types';

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: ContentRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      setContent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setContent(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Content Generator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate platform-optimized content from a topic or rewrite existing text
        </p>
      </div>

      {!content ? (
        <>
          <GeneratorForm onSubmit={handleGenerate} loading={loading} />
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Generated Content</h2>
            <Button variant="outline" onClick={handleReset}>
              Generate New
            </Button>
          </div>
          <ContentDisplay content={content} />
        </>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg">Generating your content...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      )}
    </div>
  );
}