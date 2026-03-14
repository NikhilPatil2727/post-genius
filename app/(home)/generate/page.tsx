'use client';

import { useState, useEffect } from 'react';
import GeneratorForm from '@/modules/generator/components/GeneratorForm';
import { ContentDisplay } from '@/modules/generator/components/ContentDisplay';
import { LayoutTemplate, Key, AlertCircle, X, Wand2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ContentResponse, ContentRequest } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStreamAction } from '@/modules/generator/actions';

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentResponse>({
    linkedin: '',
    twitter: '',
    instagram: '',
    peerlist: '',
  });
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyError, setShowApiKeyError] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
  };

  const handleGenerate = async (data: ContentRequest) => {
    if (!apiKey || apiKey.trim() === '') {
      setShowApiKeyError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setShowApiKeyError(false);
    setHasGenerated(true);
    
    // Reset content for new stream
    setContent({
      linkedin: '',
      twitter: '',
      instagram: '',
      peerlist: '',
    });

    try {
      const stream = await generateStreamAction({ ...data, apiKey });
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        if (accumulatedText.includes('[[ERROR]]')) {
            throw new Error(accumulatedText.split('[[ERROR]]')[1].trim());
        }

        const contentMap: Partial<ContentResponse> = {};
        const linkedinMatch = accumulatedText.match(/\[\[LINKEDIN\]\]([\s\S]*?)(?=\[\[|$)/);
        const twitterMatch = accumulatedText.match(/\[\[TWITTER\]\]([\s\S]*?)(?=\[\[|$)/);
        const instagramMatch = accumulatedText.match(/\[\[INSTAGRAM\]\]([\s\S]*?)(?=\[\[|$)/);
        const peerlistMatch = accumulatedText.match(/\[\[PEERLIST\]\]([\s\S]*?)(?=\[\[|$)/);

        if (linkedinMatch) contentMap.linkedin = linkedinMatch[1].trim();
        if (twitterMatch) contentMap.twitter = twitterMatch[1].trim();
        if (instagramMatch) contentMap.instagram = instagramMatch[1].trim();
        if (peerlistMatch) contentMap.peerlist = peerlistMatch[1].trim();

        if (Object.keys(contentMap).length > 0) {
            setContent(prev => ({ ...prev, ...contentMap }));
        }
      }
    } catch (err) {
      console.error('Generation Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasGenerated(false);
    setContent({
      linkedin: '',
      twitter: '',
      instagram: '',
      peerlist: '',
    });
    setError(null);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .page-shell {
          display: grid;
          grid-template-rows: auto 1fr;
          height: calc(100vh - 73px);
          overflow: hidden;
        }
        .main-body {
          display: grid;
          grid-template-columns: 280px 1fr;
          overflow: hidden;
          height: 100%;
        }
        @media (max-width: 1024px) {
          .main-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }
        }
      `}} />
      <div className="page-shell bg-background relative">
        {/* Topbar */}
        <div className="flex-shrink-0 flex items-center justify-between py-3 px-6 border-b border-border bg-white dark:bg-black/40 z-10 w-full shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Wand2 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Content Studio
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-72 hidden sm:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Key className="h-3 w-3 text-zinc-400" />
              </div>
              <Input
                type="password"
                placeholder="Gemini API Key..."
                value={apiKey}
                onChange={handleApiKeyChange}
                className="pl-8 h-8 md:h-9 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-md focus-visible:ring-primary text-xs shadow-inner"
              />
            </div>
            {hasGenerated && !loading && (
              <Button variant="outline" size="sm" onClick={handleReset} className="h-8 md:h-9 rounded-md font-bold px-3 text-xs">
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* API Error Alert - Absolute */}
        <AnimatePresence>
          {showApiKeyError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[60px] left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
              <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 p-3 rounded-lg flex items-center gap-3 shadow-xl backdrop-blur-md">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <p className="flex-1 text-xs font-medium text-amber-900 dark:text-amber-100">
                  Please enter your API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline font-bold decoration-amber-400/50 hover:decoration-amber-400">Google AI Studio</a>.
                </p>
                <Button variant="ghost" size="icon" onClick={() => setShowApiKeyError(false)} className="h-6 w-6 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-md flex-shrink-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Body Grid */}
        <div className="main-body bg-zinc-50/50 dark:bg-zinc-950/20">
          {/* Left panel */}
          <div className="border-r border-border bg-white dark:bg-zinc-950/50 z-0 h-full overflow-hidden relative shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            <GeneratorForm onSubmit={handleGenerate} loading={loading} />
            
            <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-[80px] left-4 right-4 p-3 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900/50 rounded-xl shadow-lg backdrop-blur-md z-50"
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <p className="font-bold text-xs uppercase tracking-wider">Error</p>
                    </div>
                    <p className="text-[10px] text-red-500 font-mono bg-white/60 dark:bg-black/40 p-2 rounded break-words max-h-24 overflow-y-auto">
                      {error}
                    </p>
                    <div className="mt-2 flex justify-end">
                      <Button variant="secondary" size="sm" onClick={() => setError(null)} className="h-6 rounded text-[10px] px-2 font-bold">Dismiss</Button>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Right panel */}
          <div className="h-full overflow-hidden w-full relative">
            {hasGenerated ? (
              <ContentDisplay content={content} isStreaming={loading} />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center opacity-80">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-[1.2]" />
                    <div className="relative bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-xl border border-zinc-100 dark:border-zinc-800">
                      <LayoutTemplate className="h-10 w-10 text-primary" />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 flex items-center justify-center gap-2">
                  Ready to Generate <Sparkles className="h-4 w-4 text-yellow-500" />
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-xs leading-relaxed font-medium">
                  Configure your post on the left. The optimized content will appear here in real-time.
                </p>

                <div className="mt-12 flex gap-6 items-center opacity-30 grayscale pointer-events-none">
                    <div className="flex flex-col items-center gap-1.5">
                         <span className="h-1.5 w-10 rounded-full bg-blue-500" />
                         <span className="text-[9px] font-black tracking-widest uppercase">LinkedIn</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                         <span className="h-1.5 w-10 rounded-full bg-slate-900 dark:bg-white" />
                         <span className="text-[9px] font-black tracking-widest uppercase">Twitter</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}