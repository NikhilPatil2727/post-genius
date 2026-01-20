'use client';

import { useState } from 'react';
import GeneratorForm from '@/components/GeneratorForm';
import { ContentDisplay } from '@/components/ContentDisplay';
import { Loader2, LayoutTemplate } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Content Studio
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Create platform-optimized posts in seconds using AI.
            </p>
          </div>
          {content && (
            <Button variant="outline" onClick={handleReset} className="hidden md:flex">
              Start Over
            </Button>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Form (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 z-10">
            <GeneratorForm onSubmit={handleGenerate} loading={loading} />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  {error}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Output Display */}
          <div className="lg:col-span-8 min-h-[500px]">
            {content ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6 lg:hidden">
                   <h2 className="text-xl font-semibold">Results</h2>
                   <Button variant="outline" size="sm" onClick={handleReset}>New</Button>
                </div>
                <ContentDisplay content={content} />
              </div>
            ) : (
              // Empty State Placeholder
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 p-8 text-center">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
                  <LayoutTemplate className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Ready to Generate
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mt-2">
                  Fill out the form on the left to generate optimized content for LinkedIn, Twitter, Instagram, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold">Crafting your content...</p>
              <p className="text-sm text-muted-foreground">Polishing for LinkedIn, X, and Instagram.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}