'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import GeneratorForm from '@/modules/generator/components/GeneratorForm';
import { ContentDisplay } from '@/modules/generator/components/ContentDisplay';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ContentResponse, ContentRequest } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { toUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';
import { requestJson } from '@/lib/api-client';

const CONTENT_PLATFORMS = ['linkedin', 'twitter', 'instagram', 'peerlist'] as const;
type ContentPlatformKey = (typeof CONTENT_PLATFORMS)[number];
const FREE_LIMIT_MESSAGE = 'Your free limit has been exceeded. Please try again later.';

const isYouTubeUrl = (value?: string | null) =>
  Boolean(value && /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/i.test(value));

type PostDetailsResponse =
  | {
      success: true;
      post: {
        topic: string | null;
        sourceText: string | null;
        tone: string | null;
        audience: string | null;
        variants: Array<{ platform: string; content: string }>;
      };
    }
  | {
      success: false;
      error: string;
    };

type GeneratedContentResponse =
  | {
      success: true;
      content: ContentResponse;
    }
  | {
      success: false;
      error: string;
    };

type SavePostResponse =
  | {
      success: true;
      post: {
        id: string;
        topic: string | null;
        sourceText: string | null;
        createdAt: string;
        variants: Array<{ platform: string }>;
      };
    }
  | {
      success: false;
      error: string;
    };

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
  const [initialData, setInitialData] = useState<Partial<ContentRequest>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const generatorFormKey = JSON.stringify(initialData);

  const loadPost = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const result = await requestJson<PostDetailsResponse>(`/api/posts/${id}`);
      if (!result.success) {
        setError(result.error || 'We could not load this post.');
        return;
      }

      const { topic, sourceText, tone, audience, variants } = result.post;
      const isYoutubeSource = !topic && isYouTubeUrl(sourceText);

      setInitialData({
        mode: topic ? 'topic' : isYouTubeUrl(sourceText) ? 'youtube' : 'rewrite',
        topic: topic || '',
        text: isYoutubeSource ? '' : sourceText || '',
        youtubeUrl: isYoutubeSource ? sourceText || '' : '',
        tone: tone || 'professional',
        audience: audience || 'general',
      });

      const newContent: ContentResponse = {
        linkedin: '',
        twitter: '',
        instagram: '',
        peerlist: '',
      };

      variants.forEach((v: { platform: string; content: string }) => {
        const platformKey = v.platform.toLowerCase() as ContentPlatformKey;
        if (CONTENT_PLATFORMS.includes(platformKey)) {
          newContent[platformKey] = v.content;
        }
      });

      setContent(newContent);
      setHasGenerated(true);
      setError(null);
    } catch (err) {
      console.error('Failed to load post:', err);
      setError(toUserFriendlyError(err, 'We could not load this post.'));
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

  const saveGeneratedContent = useCallback(
    async (data: Partial<ContentRequest>, finalContent: ContentResponse) => {
      const variants = [
        { platform: 'LINKEDIN' as const, content: finalContent.linkedin },
        { platform: 'TWITTER' as const, content: finalContent.twitter },
        { platform: 'INSTAGRAM' as const, content: finalContent.instagram },
        { platform: 'PEERLIST' as const, content: finalContent.peerlist },
      ].filter((v) => v.content.length > 0);

      if (variants.length === 0) {
        throw new Error('No content was generated. Please try a clearer topic or rewrite input.');
      }

      const result = await requestJson<SavePostResponse>('/api/posts', {
        method: 'POST',
        body: {
          topic: data.mode === 'topic' ? data.topic : undefined,
          sourceText: data.mode === 'youtube' ? data.youtubeUrl : data.text,
          tone: data.tone,
          audience: data.audience,
          variants,
        },
      });

      if (result.success && result.post) {
        window.dispatchEvent(new CustomEvent('post-saved', { detail: result.post }));
        router.replace(`/admin/generate?id=${result.post.id}`);
        router.refresh();
        return;
      }

      throw new Error(result.success ? 'Your content was saved, but no post was returned.' : result.error);
    },
    [router]
  );

  useEffect(() => {
    if (postId) {
      clearPage();
      loadPost(postId);
    } else {
      clearPage();
    }
  }, [postId, loadPost, clearPage]);

  const handleGenerate = async (data: ContentRequest) => {
    setLoading(true);
    setError(null);
    setHasGenerated(true);
    setContent({
      linkedin: '',
      twitter: '',
      instagram: '',
      peerlist: '',
    });
    setInitialData(data);

    try {
      const finalContent: ContentResponse = {
        linkedin: '',
        twitter: '',
        instagram: '',
        peerlist: '',
      };

      if (data.mode === 'youtube') {
        const result = await requestJson<GeneratedContentResponse>('/api/youtube', {
          method: 'POST',
          body: {
            youtubeUrl: data.youtubeUrl,
            tone: data.tone,
            audience: data.audience,
          },
        });

        if (result.success) {
          Object.assign(finalContent, result.content);
          setContent(result.content);
        } else {
          throw new Error(result.error || 'We could not process this YouTube video.');
        }
      } else {
        const result = await requestJson<GeneratedContentResponse>('/api/posts/generate', {
          method: 'POST',
          body: data,
        });

        if (result.success) {
          Object.assign(finalContent, result.content);
          setContent(result.content);
        } else {
          throw new Error(result.error || 'We could not generate your content right now.');
        }
      }

      await saveGeneratedContent(data, finalContent);
    } catch (err) {
      console.error('Generation process error:', err);
      const message = toUserFriendlyError(
        err,
        'We could not generate your content right now. Please try again.'
      );

      if (message === FREE_LIMIT_MESSAGE) {
        toast.error(message);
        setError(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearPage();
    router.push('/admin/generate');
  };

  const handleVariantUpdated = (platform: ContentPlatformKey, updatedVariantContent: string) => {
    setContent((currentContent) => ({
      ...currentContent,
      [platform]: updatedVariantContent,
    }));
  };

  return (
    <div className="min-h-full py-4 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/50">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 font-serif">
                Content Studio
              </h1>
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              Transform your ideas into high-performance social media posts using advanced AI models.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {hasGenerated && !loading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-10 rounded-xl font-bold px-6 bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 transition-all border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm"
              >
                New Draft
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 lg:sticky lg:top-8"
        >
          <GeneratorForm
            key={generatorFormKey}
            onSubmit={handleGenerate}
            loading={loading}
            initialData={initialData}
          />

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
                <p className="text-sm text-red-500/90 dark:text-red-400 mb-4 break-words leading-relaxed">
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
            <ContentDisplay
              content={content}
              postId={postId}
              onVariantUpdated={handleVariantUpdated}
            />
          ) : (
            <div className="min-h-[500px] rounded-[2rem] border border-zinc-200/70 bg-white/80 p-8 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/30">
              {loading ? (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-5">
                  <div className="h-12 w-12 rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100 animate-spin" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Preparing drafts</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Generating content for your selected platforms.</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[420px] flex-col justify-between">
                  <div className="max-w-2xl space-y-4">
                    <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                      Editorial workspace
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                        Start with one clear idea
                      </h3>
                      <p className="max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        Add a topic or paste a draft on the left. Your generated content will appear here in a clean review area where you can edit, check length, and copy each platform version.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 pt-8 md:grid-cols-3">
                    {[
                      {
                        title: 'Create',
                        description: 'Generate first drafts for LinkedIn, X, Instagram, and Peerlist from one input.',
                      },
                      {
                        title: 'Review',
                        description: 'Read each version in a focused layout designed for quick checking and revision.',
                      },
                      {
                        title: 'Refine',
                        description: 'Use the inline editor to adjust tone, structure, and formatting before you publish.',
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/40"
                      >
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}
