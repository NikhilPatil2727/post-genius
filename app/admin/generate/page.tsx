'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import GeneratorForm from '@/modules/generator/components/GeneratorForm';
import { ContentDisplay } from '@/modules/generator/components/ContentDisplay';
import { LayoutTemplate, Key, AlertCircle, X, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ContentResponse, ContentRequest } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStreamAction, savePostAction, getPostByIdAction } from '@/modules/generator/actions';
import { useRouter, useSearchParams } from 'next/navigation';

function GeneratePageContent() {
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
  const [initialData, setInitialData] = useState<Partial<ContentRequest>>({});
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  // Load post if ID is present in URL
  const loadPost = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const result = await getPostByIdAction(id);
      if (result.success && result.post) {
        const { topic, sourceText, tone, audience, variants } = result.post;
        
        // Update form data
        setInitialData({
          mode: topic ? 'topic' : 'rewrite',
          topic: topic || '',
          text: sourceText || '',
          tone: tone || 'professional',
          audience: audience || 'general'
        });

        const newContent: ContentResponse = {
          linkedin: '',
          twitter: '',
          instagram: '',
          peerlist: '',
        };
        
        variants.forEach((v: any) => {
          const platformKey = v.platform.toLowerCase() as keyof ContentResponse;
          if (platformKey in newContent) {
            (newContent as any)[platformKey] = v.content;
          }
        });
        
        setContent(newContent);
        setHasGenerated(true);
        setError(null);
      } else {
        setError(result.error || 'Failed to load post');
      }
    } catch (err) {
      console.error("Failed to load post:", err);
      setError('An error occurred while loading the post');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPage = useCallback(() => {
    setHasGenerated(false);
    setInitialData({});
    setContent({
      linkedin: '',
      twitter: '',
      instagram: '',
      peerlist: '',
    });
    setError(null);
  }, []);

  useEffect(() => {
    if (postId) {
      loadPost(postId);
    } else {
      clearPage();
    }
  }, [postId, loadPost, clearPage]);

  // Load API key from localStorage
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

    // Reset content for new generation
    setContent({
      linkedin: '',
      twitter: '',
      instagram: '',
      peerlist: '',
    });

    try {
      // Call the Server Action directly
      const stream = await generateStreamAction({ ...data, apiKey });

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let accumulatedText = '';
      const finalContent: ContentResponse = {
        linkedin: '',
        twitter: '',
        instagram: '',
        peerlist: '',
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Check for error marker from server action
        if (accumulatedText.includes('[[ERROR]]')) {
          throw new Error(accumulatedText.split('[[ERROR]]')[1].trim());
        }

        // Extract content between markers using Regex
        const contentMap: Partial<ContentResponse> = {};

        const linkedinMatch = accumulatedText.match(/\[\[LINKEDIN\]\]([\s\S]*?)(?=\[\[|$)/);
        const twitterMatch = accumulatedText.match(/\[\[TWITTER\]\]([\s\S]*?)(?=\[\[|$)/);
        const instagramMatch = accumulatedText.match(/\[\[INSTAGRAM\]\]([\s\S]*?)(?=\[\[|$)/);
        const peerlistMatch = accumulatedText.match(/\[\[PEERLIST\]\]([\s\S]*?)(?=\[\[|$)/);

        if (linkedinMatch) {
          contentMap.linkedin = linkedinMatch[1].trim();
          finalContent.linkedin = contentMap.linkedin;
        }
        if (twitterMatch) {
          contentMap.twitter = twitterMatch[1].trim();
          finalContent.twitter = contentMap.twitter;
        }
        if (instagramMatch) {
          contentMap.instagram = instagramMatch[1].trim();
          finalContent.instagram = contentMap.instagram;
        }
        if (peerlistMatch) {
          contentMap.peerlist = peerlistMatch[1].trim();
          finalContent.peerlist = contentMap.peerlist;
        }

        if (Object.keys(contentMap).length > 0) {
          setContent(prev => ({ ...prev, ...contentMap }));
        }
      }

      // Automatically save after generation
      const variants = [
        { platform: 'LINKEDIN' as const, content: finalContent.linkedin },
        { platform: 'TWITTER' as const, content: finalContent.twitter },
        { platform: 'INSTAGRAM' as const, content: finalContent.instagram },
        { platform: 'PEERLIST' as const, content: finalContent.peerlist },
      ].filter(v => v.content.length > 0);

      if (variants.length > 0) {
        await savePostAction({
          topic: data.topic,
          sourceText: data.text,
          tone: data.tone,
          audience: data.audience,
          variants
        });
        // Dispatch event for sidebar to refresh
        window.dispatchEvent(new Event('post-saved'));
      }

    } catch (err) {
      console.error('Generation process error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearPage();
    router.push('/admin/generate');
  };

  return (
    <div className="min-h-full py-4 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">

      {/* Premium Header Container */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/50">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary shadow-sm border border-primary/20">
                <Wand2 className="h-5 w-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 font-serif">
                Content Studio
              </h1>
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              Transform your ideas into high-performance social media posts using advanced AI models.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-72 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                <Key className="h-4 w-4 text-zinc-400" />
              </div>
              <Input
                type="password"
                placeholder="Gemini API Key..."
                value={apiKey}
                onChange={handleApiKeyChange}
                className="pl-9 h-10 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-primary shadow-sm text-sm transition-all focus-visible:shadow-md"
              />
            </div>
            {hasGenerated && !loading && (
              <Button variant="outline" size="sm" onClick={handleReset} className="h-10 rounded-xl font-bold px-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] transition-all bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                New Draft
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
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl flex items-start gap-4 shadow-sm mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-amber-900 dark:text-amber-100 mb-1">
                  Gemini API Key Required
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                  To stream high-quality content, we need your free API key. Get it in 2 seconds at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline font-bold decoration-amber-500/50 hover:decoration-amber-500">Google AI Studio</a>.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowApiKeyError(false)} className="text-amber-500 shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 lg:sticky lg:top-8"
        >
          <GeneratorForm onSubmit={handleGenerate} loading={loading} initialData={initialData} />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-base font-bold text-red-600">Action Failed</p>
                </div>
                <p className="text-sm text-red-500/90 dark:text-red-400 mb-4 font-mono break-words leading-relaxed">
                  {error}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 w-full font-bold rounded-xl"
                  onClick={() => setError(null)}
                >
                  Clear Error
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 min-h-[600px]"
        >
          {hasGenerated ? (
            <ContentDisplay content={content} isStreaming={loading} />
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-zinc-50/30 dark:bg-zinc-950/20 p-12 text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-1000" />
                <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 transition-transform duration-500 group-hover:scale-110">
                  <LayoutTemplate className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-center gap-2">
                  Empty Canvas <Sparkles className="h-5 w-5 text-yellow-500" />
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                  Your platform-ready content will materialize here in real-time. Start by providing a topic or a draft on the left.
                </p>
              </div>

              <div className="mt-12 flex gap-4">
                <div className="flex flex-col items-center gap-1.5 opacity-50">
                  <div className="h-1.5 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-50">
                  <div className="h-1.5 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest">X / Twitter</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-50">
                  <div className="h-1.5 w-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 dark:border-zinc-200">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full border-2 border-white/20 dark:border-zinc-900/20 border-t-white dark:border-t-zinc-900 animate-spin" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{postId ? 'Loading Post' : 'Crafting Content'}</span>
                  <span className="text-[10px] opacity-70 font-medium font-mono uppercase tracking-tighter">{postId ? 'Retrieving from history...' : 'AI-Streaming in progress...'}</span>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GeneratePageContent />
    </Suspense>
  );
}
