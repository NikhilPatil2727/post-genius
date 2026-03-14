'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Info, LayoutPanelLeft, Download, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormattedText } from './FormattedText';
import type { ContentResponse, Platform } from '@/types';
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ContentDisplayProps {
  content: ContentResponse;
  isStreaming?: boolean;
}

const PLATFORM_CONFIG: Record<string, {
  name: string;
  icon: React.ReactNode;
  color: string;
  brand: string;
  bg: string;
  border: string;
  accent: string;
  characterLimit?: number;
}> = {
  linkedin: {
    name: 'LinkedIn',
    icon: <FaLinkedin className="h-4 w-4" />,
    color: "text-[#0077B5]",
    brand: "#0077B5",
    bg: "bg-[#0077B5]/10 dark:bg-[#0077B5]/20",
    border: "border-[#0077B5]/30 dark:border-[#0077B5]/40",
    accent: "bg-[#0077B5]",
    characterLimit: 8000
  },
  twitter: {
    name: 'Twitter',
    icon: <FaXTwitter className="h-4 w-4" />,
    color: "text-slate-900 dark:text-slate-100",
    brand: "#000000",
    bg: "bg-black/5 dark:bg-white/10",
    border: "border-black/20 dark:border-white/20",
    accent: "bg-black dark:bg-white",
    characterLimit: 280
  },
  instagram: {
    name: 'Instagram',
    icon: <FaInstagram className="h-4 w-4" />,
    color: "text-[#E4405F]",
    brand: "#E4405F",
    bg: "bg-pink-50/50 dark:bg-pink-900/10",
    border: "border-pink-200/50 dark:border-pink-800/50",
    accent: "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]",
    characterLimit: 600
  },
  peerlist: {
    name: 'Peerlist',
    icon: <SiPeerlist className="h-4 w-4" />,
    color: "text-[#00AA45]",
    brand: "#00AA45",
    bg: "bg-[#00AA45]/10 dark:bg-[#00AA45]/20",
    border: "border-[#00AA45]/30 dark:border-[#00AA45]/40",
    accent: "bg-[#00AA45]",
    characterLimit: 2000,
  },
};

function useTypingEffect(rawContent: string, isActive: boolean, isStreaming: boolean) {
  const [displayedContent, setDisplayedContent] = useState('');
  const bufferRef = useRef('');
  const lastRawRef = useRef('');
  const frameRef = useRef<number | null>(null);
  const isActiveRef = useRef(isActive);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    if (rawContent.length > lastRawRef.current.length) {
      const newChars = rawContent.slice(lastRawRef.current.length);
      bufferRef.current += newChars;
      lastRawRef.current = rawContent;
    }

    if (!isActive && !isStreaming && !hasStartedRef.current) {
      setDisplayedContent(rawContent);
      return;
    }

    if (!frameRef.current && bufferRef.current.length > 0) {
      hasStartedRef.current = true;
      const animate = () => {
        if (bufferRef.current.length > 0) {
          const charsPerFrame = isActiveRef.current ? 2 : 32;
          const chunk = bufferRef.current.slice(0, charsPerFrame);
          bufferRef.current = bufferRef.current.slice(charsPerFrame);
          setDisplayedContent(prev => prev + chunk);
          frameRef.current = requestAnimationFrame(animate);
        } else {
          frameRef.current = null;
        }
      };
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [rawContent, isActive, isStreaming]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const prevStreamingRef = useRef(isStreaming);
  useEffect(() => {
    if (isStreaming && !prevStreamingRef.current) {
      setDisplayedContent('');
      bufferRef.current = '';
      lastRawRef.current = '';
      hasStartedRef.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    }
    prevStreamingRef.current = isStreaming;
  }, [isStreaming]);

  return displayedContent;
}

// Platforms that support inline editing
const EDITABLE_PLATFORMS: Platform[] = ['linkedin', 'twitter', 'instagram', 'peerlist'];

export function ContentDisplay({ content, isStreaming }: ContentDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('linkedin');
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const streamingPlatformRef = useRef<Platform | null>(null);
  const hasAutoSwitchedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const platformIds: Platform[] = ['linkedin', 'twitter', 'instagram', 'peerlist'];

  const currentlyStreaming = isStreaming
    ? [...platformIds].reverse().find(id => (content[id]?.length ?? 0) > 0) ?? null
    : null;

  if (currentlyStreaming) {
    const currentIdx = platformIds.indexOf(currentlyStreaming);
    const prevIdx = platformIds.indexOf(streamingPlatformRef.current ?? 'linkedin');
    if (currentIdx >= prevIdx) {
      streamingPlatformRef.current = currentlyStreaming;
    }
  }
  if (!isStreaming) streamingPlatformRef.current = null;

  const streamingPlatform = isStreaming ? streamingPlatformRef.current : null;

  const completedPlatforms = platformIds.filter(id => {
    const hasContent = (content[id]?.length ?? 0) > 0;
    if (!isStreaming) return hasContent;
    if (!streamingPlatform) return false;
    return hasContent && id !== streamingPlatform && platformIds.indexOf(id) < platformIds.indexOf(streamingPlatform);
  });

  const displayedContents: Record<string, string> = {
    linkedin: useTypingEffect(content.linkedin || "", streamingPlatform === 'linkedin', !!isStreaming),
    twitter: useTypingEffect(content.twitter || "", streamingPlatform === 'twitter', !!isStreaming),
    instagram: useTypingEffect(content.instagram || "", streamingPlatform === 'instagram', !!isStreaming),
    peerlist: useTypingEffect(content.peerlist || "", streamingPlatform === 'peerlist', !!isStreaming)
  };

  const copyToClipboard = async (text: string, id: string) => {
    const cleanText = text.replace(/\*\*/g, '');
    await navigator.clipboard.writeText(cleanText);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    const allContent = platformIds
      .map((id) => {
        const config = PLATFORM_CONFIG[id];
        return content[id] ? `--- ${config.name.toUpperCase()} ---\n${content[id]}\n` : "";
      })
      .filter(Boolean)
      .join('\n');
    await navigator.clipboard.writeText(allContent.replace(/\*\*/g, ''));
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    if (isStreaming && streamingPlatform && !hasAutoSwitchedRef.current) {
      setActiveTab(streamingPlatform);
      hasAutoSwitchedRef.current = true;
    }
    if (!isStreaming) {
      hasAutoSwitchedRef.current = false;
    }
  }, [streamingPlatform, isStreaming]);

  // Cancel editing when streaming starts or tab changes
  useEffect(() => {
    if (isStreaming) {
      setEditingPlatform(null);
      setEditedContent({});
    }
  }, [isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (editingPlatform && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [editingPlatform]);

  const isEditable = EDITABLE_PLATFORMS.includes(activeTab as Platform);
  const isEditing = editingPlatform === activeTab;

  const startEditing = () => {
    const currentContent = String(content[activeTab as keyof ContentResponse] || '');
    setEditedContent(prev => ({ ...prev, [activeTab]: currentContent }));
    setEditingPlatform(activeTab);
  };

  const saveEdit = () => {
    // Save the edited content back (the editedContent stays in state for display)
    setEditingPlatform(null);
  };

  const cancelEdit = () => {
    setEditingPlatform(null);
    setEditedContent(prev => {
      const next = { ...prev };
      delete next[activeTab];
      return next;
    });
  };

  // Get the display text for the active tab (edited version if available)
  const getActiveContent = () => {
    if (editedContent[activeTab] !== undefined) return editedContent[activeTab];
    return String(content[activeTab as keyof ContentResponse] || '');
  };

  const activeConfig = PLATFORM_CONFIG[activeTab];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .content-panel-outer {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
        }
        .tabs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-bottom: 0.5px solid rgba(161, 161, 170, 0.4);
        }
        .tab-item {
          padding: 10px 0;
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: rgba(161, 161, 170, 0.8);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .tab-item.active {
          border-bottom: 2px solid currentColor;
          color: inherit;
        }
        .tab-item.active .dark {
           color: white;
        }
        .content-area-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .content-area-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .content-area-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(161, 161, 170, 0.2);
          border-radius: 10px;
        }
      `}} />
      <div className="content-panel-outer w-full bg-white/50 dark:bg-zinc-950/20">
        {/* Platform header row: flex-shrink-0 */}
        <div className="flex-shrink-0 flex items-center justify-between py-3 px-5 border-b border-border/40 bg-zinc-50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <LayoutPanelLeft className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold tracking-tight">AI Content Variants</h3>

            {isStreaming && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 ml-2">
                <div className="flex items-center gap-0.5 h-1.5">
                  <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-primary rounded-full" />
                  <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-0.5 bg-primary rounded-full" />
                  <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-0.5 bg-primary rounded-full" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Streaming</span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={copyAll}
            disabled={isStreaming || !content.linkedin}
            className="h-7 text-xs font-bold px-3 gap-1.5 rounded-md shadow-sm"
          >
            {copied === 'all' ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied All</span>
              </>
            ) : (
              <>
                <Download className="h-3 w-3" />
                <span>Export All</span>
              </>
            )}
          </Button>
        </div>

        {/* Tabs row: flex-shrink-0 */}
        <div className="flex-shrink-0 bg-white dark:bg-zinc-950 sticky top-0 z-10">
          <div className="tabs-grid">
            {platformIds.map((id) => {
              const config = PLATFORM_CONFIG[id];
              const isCompleted = completedPlatforms.includes(id);
              const isActive = activeTab === id;

              return (
                <div
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "tab-item",
                    isActive ? "active" : "hover:text-zinc-600 dark:hover:text-zinc-300"
                  )}
                  style={isActive ? { borderColor: config.brand, color: config.brand } : {}}
                >
                  <span className={cn(isActive && config.color)}>{config.name}</span>
                  {isCompleted && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content card area: flex: 1, overflow-y: auto, padding: 16px 20px */}
        <div className="flex-1 overflow-y-auto w-full content-area-scroll p-[16px_20px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl mx-auto"
            >
              <Card className={cn(
                "overflow-hidden border border-border/60 shadow-md bg-white dark:bg-zinc-950 rounded-xl relative",
                "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:z-10",
                activeTab === 'linkedin' && "before:bg-[#0077B5]",
                activeTab === 'twitter' && "before:bg-black dark:before:bg-white",
                activeTab === 'instagram' && "before:bg-gradient-to-b before:from-[#f09433] before:via-[#e6683c] before:to-[#bc1888]",
                activeTab === 'peerlist' && "before:bg-[#00AA45]"
              )}>
                {isStreaming && streamingPlatform === activeTab && (
                  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="w-[200%] h-full absolute top-0 -left-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.03),transparent)] dark:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.01),transparent)] animate-[shimmer_3s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
                  </div>
                )}

                <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/10">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("p-1.5 rounded-lg", activeConfig.bg, activeConfig.color)}>
                      {activeConfig.icon}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">{activeConfig.name}</CardTitle>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit button — only for Twitter, Instagram, Peerlist */}
                    {isEditable && !isEditing && !isStreaming && content[activeTab as keyof ContentResponse] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startEditing}
                        className="h-7 px-3 rounded-md font-bold text-xs bg-white dark:bg-zinc-900 border border-border/50 shadow-sm transition-all hover:border-primary/40 hover:text-primary"
                      >
                        <div className="flex items-center gap-1.5">
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </div>
                      </Button>
                    )}

                    {/* Save / Cancel buttons when editing */}
                    {isEditing && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEdit}
                          className="h-7 px-3 rounded-md font-bold text-xs bg-white dark:bg-zinc-900 border border-border/50 shadow-sm transition-all hover:border-red-400 hover:text-red-500"
                        >
                          <div className="flex items-center gap-1.5">
                            <X className="h-3.5 w-3.5" />
                            <span>Cancel</span>
                          </div>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveEdit}
                          className="h-7 px-3 rounded-md font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700 shadow-sm transition-all text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                        >
                          <div className="flex items-center gap-1.5">
                            <Save className="h-3.5 w-3.5" />
                            <span>Save</span>
                          </div>
                        </Button>
                      </>
                    )}

                    {/* Copy button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(getActiveContent(), activeTab)}
                      disabled={!(content[activeTab as keyof ContentResponse])}
                      className="h-7 px-3 rounded-md font-bold text-xs bg-white dark:bg-zinc-900 border border-border/50 shadow-sm transition-all"
                    >
                      {copied === activeTab ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Size naturally by not enforcing min-h */}
                  <div className="p-5 md:p-6 relative">
                    {content[activeTab as keyof ContentResponse] ? (
                      <div className="relative z-10 transition-all">
                        {/* Mock Platform Header */}
                        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm", activeConfig.accent)}>
                            P
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-xs">PostBloom AI</span>
                              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 flex items-center justify-center">
                                <Check className="h-1.5 w-1.5 text-white" />
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                              <span>Just now</span>
                              <span>•</span>
                              {activeConfig.icon}
                            </div>
                          </div>
                        </div>

                        {/* Editing mode: show textarea */}
                        {isEditing ? (
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-lg bg-primary/5 dark:bg-primary/10 pointer-events-none" />
                            <textarea
                              ref={textareaRef}
                              value={editedContent[activeTab] || ''}
                              onChange={(e) => {
                                setEditedContent(prev => ({ ...prev, [activeTab]: e.target.value }));
                                // Auto-resize
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                              }}
                              className="relative w-full min-h-[120px] text-sm md:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans tracking-tight bg-transparent border border-primary/30 dark:border-primary/40 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                              style={{ overflow: 'hidden' }}
                            />
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                              <Pencil className="h-3 w-3" />
                              <span>Editing {activeConfig.name} content — changes will be reflected in copy</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FormattedText
                              text={editedContent[activeTab] !== undefined ? editedContent[activeTab] : (displayedContents[activeTab] || "")}
                              className="text-sm md:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans tracking-tight whitespace-pre-wrap"
                            />
                            {isStreaming && streamingPlatform === activeTab && (
                              <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className={cn("inline-block w-1 h-4 ml-1 translate-y-0.5 rounded-full", activeConfig.accent)}
                              />
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-4">
                        {isStreaming ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                            <span className="text-xs font-medium font-mono">Generating {activeConfig.name} content...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 opacity-50">
                            {activeConfig.icon}
                            <p className="text-xs font-medium">No content generated yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Character Audit Bar - padding 8px 14px */}
                  {activeConfig.characterLimit && (content[activeTab as keyof ContentResponse]) && (() => {
                    const auditText = getActiveContent();
                    const charLen = auditText.length;
                    const limit = activeConfig.characterLimit || 280;
                    return (
                      <div className="px-[14px] py-[8px] bg-zinc-50/80 dark:bg-zinc-900/60 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground hidden sm:block">Length Audit</span>
                          {charLen <= limit ? (
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                              <Check className="h-2.5 w-2.5" />
                              <span>Good</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[9px] font-bold">
                              <Info className="h-2.5 w-2.5" />
                              <span>Over Limit</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Small Segmented Progress Bar */}
                          <div className="flex gap-0.5 h-1 w-20 sm:w-24">
                            {[...Array(10)].map((_, i) => {
                              const progress = (charLen / limit) * 10;
                              let bgColor = "bg-zinc-200 dark:bg-zinc-800";
                              if (i < progress) {
                                if (progress > 10) bgColor = "bg-red-500";
                                else if (progress > 8) bgColor = "bg-amber-500";
                                else bgColor = i === 9 ? "bg-amber-500" : "bg-emerald-500";
                              }
                              return (
                                <div key={i} className={cn("flex-1 rounded-full", bgColor)} />
                              );
                            })}
                          </div>

                          <span className={cn(
                            "text-[10px] font-mono font-bold",
                            charLen > limit
                              ? "text-red-500"
                              : "text-zinc-600 dark:text-zinc-400"
                          )}>
                            {charLen} <span className="opacity-50">/</span> {limit}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}