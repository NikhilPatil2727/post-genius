'use client';

import { useState, useEffect } from 'react';
import GeneratorForm from '@/modules/generator/components/GeneratorForm';
import { ContentDisplay } from '@/modules/generator/components/ContentDisplay';
import { Loader2, LayoutTemplate, Key, AlertCircle, X } from 'lucide-react'; // Added icons for API key and alerts
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import Shadcn UI Input
import type { ContentResponse, ContentRequest } from '@/types';
import { generateAction } from '@/modules/generator/actions';

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // --- USER API KEY STATE ---
  // Store the Gemini API key provided by the user
  const [apiKey, setApiKey] = useState<string>('');
  // State to handle the "API key missing" popup
  const [showApiKeyError, setShowApiKeyError] = useState(false);

  // Load API key from localStorage on initial mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Save API key to localStorage whenever it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
  };

  const handleGenerate = async (data: ContentRequest) => {
    // --- OPTIMIZATION: VALIDATE API KEY ---
    // If user forgot to provide the Gemni Key, show a popup/alert
    if (!apiKey || apiKey.trim() === '') {
      setShowApiKeyError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setShowApiKeyError(false);
    
    try {
      // Pass the user's API key along with the form data
      const result = await generateAction({ ...data, apiKey });
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mask-linear-from-accent-foreground">
              Content Studio
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-sans">
              Create platform-optimized posts in seconds using AI.
            </p>
          </div>

          {/* --- TOP RIGHT API KEY INPUT --- */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="password"
                placeholder="Paste Gemini API Key..."
                value={apiKey}
                onChange={handleApiKeyChange}
                className="pl-9 h-10 w-full"
              />
            </div>
            {content && (
              <Button variant="outline" onClick={handleReset} className="hidden md:flex">
                Start Over
              </Button>
            )}
          </div>
        </div>

        {/* --- API KEY ERROR POPUP MESSAGE --- */}
        {showApiKeyError && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-in zoom-in-95 duration-200 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Action Required: Gemini API Key Missing
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Please paste your Google Gemini API key in the field above to generate content. You can get one for free at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline font-medium">Google AI Studio</a>.
              </p>
            </div>
            <button 
              onClick={() => setShowApiKeyError(false)}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Form (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 z-10">
            <GeneratorForm onSubmit={handleGenerate} loading={loading} />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Generation Failed
                  </p>
                </div>
                <p className="text-xs text-red-500 dark:text-red-400/80 mb-3 ml-6 font-mono">
                  {error}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-100 w-full justify-center"
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
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 p-8 text-center text-gray-500 dark:text-slate-400">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4 border dark:border-gray-700">
                  <LayoutTemplate className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  AI Content Studio
                </h3>
                <p className="text-sm max-w-sm mt-2">
                  Once you provide your Gemini API key and fill the form, your platform-ready social posts will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4 max-w-sm w-full">
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