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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                  <Wand2 className="h-7 w-7" />
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
                Content Studio
              </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xl max-w-xl font-medium leading-relaxed">
            Craft viral, platform-native content with our elite AI engine.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full lg:w-96">
            <div className="flex items-center gap-2 mb-1">
                <Key className="h-4 w-4 text-primary" />
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Auth Configuration</label>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Paste Gemini API Key..."
                value={apiKey}
                onChange={handleApiKeyChange}
                className="h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl focus-visible:ring-primary shadow-sm"
              />
              {hasGenerated && !loading && (
                <Button variant="outline" onClick={handleReset} className="h-12 rounded-2xl font-bold px-6 border-zinc-200 dark:border-zinc-800">
                  Reset
                </Button>
              )}
            </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showApiKeyError && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-6 rounded-3xl flex items-start gap-4 mb-8">
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl text-amber-600 shadow-sm border border-amber-100 dark:border-amber-900/50">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">
                  API Key Required
                </h4>
                <p className="text-zinc-600 dark:text-amber-300 font-medium">
                  To experience live streaming, please enter your free API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline font-bold decoration-amber-400/50 hover:decoration-amber-400 decoration-2 underline-offset-4 transition-all">Google AI Studio</a>.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowApiKeyError(false)} className="text-amber-500 rounded-xl">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 lg:sticky lg:top-12"
        >
          <GeneratorForm onSubmit={handleGenerate} loading={loading} />
          
          <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-bold">Generation Error</p>
                  </div>
                  <p className="text-sm text-red-500 font-mono bg-white/50 dark:bg-black/20 p-3 rounded-xl break-words mb-4">
                    {error}
                  </p>
                  <Button variant="secondary" onClick={() => setError(null)} className="w-full rounded-xl font-bold h-10">Dismiss</Button>
                </motion.div>
              )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 min-h-[600px]"
        >
          {hasGenerated ? (
            <ContentDisplay content={content} isStreaming={loading} />
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] bg-zinc-50/20 dark:bg-zinc-950/20 p-12 text-center group transition-colors hover:bg-zinc-50/40 dark:hover:bg-zinc-950/40">
              <div className="relative mb-10">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all duration-1000 scale-150" />
                  <div className="relative bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 transform group-hover:scale-105 transition-transform duration-500">
                    <LayoutTemplate className="h-16 w-16 text-primary" />
                  </div>
              </div>
              
              <div className="space-y-4 max-w-md">
                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-center gap-3">
                    Start Your Narrative <Sparkles className="h-6 w-6 text-yellow-500" />
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">
                    Input your core concept on the left, and watch as your platform-optimized strategy materializes in real-time.
                  </p>
              </div>

              <div className="mt-16 flex gap-8 items-center opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="flex flex-col items-center gap-2">
                       <span className="h-2 w-12 rounded-full bg-blue-500" />
                       <span className="text-[10px] font-black tracking-widest uppercase">LinkedIn</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                       <span className="h-2 w-12 rounded-full bg-slate-900 dark:bg-white" />
                       <span className="text-[10px] font-black tracking-widest uppercase">X / Twitter</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                       <span className="h-2 w-12 rounded-full bg-pink-500" />
                       <span className="text-[10px] font-black tracking-widest uppercase">Instagram</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                       <span className="h-2 w-12 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-black tracking-widest uppercase">Peerlist</span>
                  </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {loading && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6"
            >
                <div className="bg-zinc-900/90 dark:bg-white/90 backdrop-blur-xl text-white dark:text-zinc-900 p-5 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10 dark:border-zinc-200">
                    <div className="flex items-center gap-5">
                        <div className="h-10 w-10 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse" />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold">Streaming Content...</span>
                            <span className="text-xs opacity-60 font-mono tracking-tighter">GEMINI-2.5-FLASH ACTIVE</span>
                        </div>
                    </div>
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <Sparkles className="h-6 w-6 text-yellow-400" />
                    </motion.div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}