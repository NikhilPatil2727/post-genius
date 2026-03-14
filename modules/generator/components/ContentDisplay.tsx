'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Info, Sparkles, LayoutPanelLeft } from 'lucide-react';
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
    recommendedRange?: [number, number];
}> = {
    linkedin: { 
      name: 'LinkedIn', 
      icon: <FaLinkedin className="h-4 w-4" />,
      color: "text-[#0077B5]",
      brand: "#0077B5",
      bg: "bg-[#0077B5]/10 dark:bg-[#0077B5]/20",
      border: "border-[#0077B5]/30 dark:border-[#0077B5]/40",
      accent: "bg-[#0077B5]",
      characterLimit: 8000,
      recommendedRange: [1200, 8000]
    },
    twitter: { 
      name: '(Twitter)', 
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

  // Keep isActiveRef in sync without triggering re-runs
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    // New content arrived — add only the new chars to buffer
    if (rawContent.length > lastRawRef.current.length) {
      const newChars = rawContent.slice(lastRawRef.current.length);
      bufferRef.current += newChars;
      lastRawRef.current = rawContent;
    }

    // If this platform was never active and streaming is done, show full content
    if (!isActive && !isStreaming && !hasStartedRef.current) {
      setDisplayedContent(rawContent);
      return;
    }

    // Start the animation loop if not already running
    if (!frameRef.current && bufferRef.current.length > 0) {
      hasStartedRef.current = true;
      const animate = () => {
        if (bufferRef.current.length > 0) {
          // Slow down when active (typewriter feel), fast when not active
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

  // Only cancel RAF on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Reset everything when isStreaming goes false→true (new generation)
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

function ThinkingPhase({ platformName, isCurrent }: { platformName: string, isCurrent: boolean }) {
  const [visibleThoughts, setVisibleThoughts] = useState<number>(0);

  const thoughts = [
      "Analyzing your input...",
      `Crafting tone for ${platformName}...`,
      "Optimizing hooks and structure...",
      "Tailoring content per platform..."
  ];

  useEffect(() => {
    // Reveal thoughts sequentially
    const intervals = thoughts.map((_, idx) => 
      setTimeout(() => setVisibleThoughts(idx + 1), idx * 800)
    );
    return () => intervals.forEach(clearTimeout);
  }, [platformName]);

  return (
    <div className="flex flex-col items-start space-y-4 font-mono text-sm md:text-base">
      {thoughts.map((thought, index) => {
        if (visibleThoughts <= index) return null;
        
        const isLatest = visibleThoughts === index + 1 && index !== thoughts.length - 1;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center justify-center w-5 flex-shrink-0">
                {isLatest && isCurrent ? (
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                  <span className="text-muted-foreground/40 text-xs">▸</span>
                )}
            </div>
            <span className={cn(
              "transition-colors duration-500",
              isLatest && isCurrent ? "text-foreground font-semibold" : "text-muted-foreground/60"
            )}>
              {thought}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ContentDisplay({ content, isStreaming }: ContentDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('linkedin');
  const lastUpdateRef = useRef<Record<string, number>>({});
  const userOverrideRef = useRef(false);
  const streamingPlatformRef = useRef<Platform | null>(null);
  const hasAutoSwitchedRef = useRef(false);

  const platformIds: Platform[] = ['linkedin', 'twitter', 'instagram', 'peerlist'];

  // Detect streaming platform by checking which is the latest platform with content
  const currentlyStreaming = isStreaming 
    ? [...platformIds].reverse().find(id => (content[id]?.length ?? 0) > 0) ?? null
    : null;
    
  // Only update forward — never go backwards (linkedin → twitter, not twitter → linkedin)
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

  // Fix 2: decouple useTypingEffect from activeTab
  const linkedinContent = useTypingEffect(content.linkedin || "", streamingPlatform === 'linkedin', !!isStreaming);
  const twitterContent = useTypingEffect(content.twitter || "", streamingPlatform === 'twitter', !!isStreaming);
  const instagramContent = useTypingEffect(content.instagram || "", streamingPlatform === 'instagram', !!isStreaming);
  const peerlistContent = useTypingEffect(content.peerlist || "", streamingPlatform === 'peerlist', !!isStreaming);

  const displayedContents: Record<string, string> = {
    linkedin: linkedinContent,
    twitter: twitterContent,
    instagram: instagramContent,
    peerlist: peerlistContent
  };

  const copyToClipboard = async (text: string, platform: string) => {
    const cleanText = text.replace(/\*\*/g, '');
    await navigator.clipboard.writeText(cleanText);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const platforms = [
    { id: 'linkedin' as Platform, content: content.linkedin || "" },
    { id: 'twitter' as Platform, content: content.twitter || "" },
    { id: 'instagram' as Platform, content: content.instagram || "" },
    { id: 'peerlist' as Platform, content: content.peerlist || "" },
  ];

  useEffect(() => {
    // Only auto-switch ONE time — when the very first platform starts streaming
    if (isStreaming && streamingPlatform && !hasAutoSwitchedRef.current) {
      setActiveTab(streamingPlatform);
      hasAutoSwitchedRef.current = true; // lock — never auto-switch again this session
    }
    // Reset when generation finishes so next generation can auto-switch once
    if (!isStreaming) {
      hasAutoSwitchedRef.current = false;
      lastUpdateRef.current = {};
      userOverrideRef.current = false;
    }
  }, [streamingPlatform, isStreaming]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <LayoutPanelLeft className="h-5 w-5" />
            </div>
            <div>
                <h3 className="text-lg font-bold tracking-tight">AI Content Variants</h3>
                <p className="text-xs text-muted-foreground">Platform-specific content flowing in real-time</p>
            </div>
        </div>
        
        {isStreaming && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center gap-0.5 h-3">
                    <motion.div 
                        animate={{ height: [4, 12, 4] }} 
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                        className="w-0.5 bg-primary rounded-full" 
                    />
                    <motion.div 
                        animate={{ height: [8, 16, 8] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                        className="w-0.5 bg-primary rounded-full" 
                    />
                    <motion.div 
                        animate={{ height: [4, 12, 4] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4, ease: "easeInOut" }}
                        className="w-0.5 bg-primary rounded-full" 
                    />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">Live Streaming</span>
            </div>
        )}
      </div>

      {isStreaming && (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-10 px-4">
            {platformIds.map((id, idx) => {
                const config = PLATFORM_CONFIG[id];
                const hasContent = (content[id]?.length ?? 0) > 0;
                const isCurrent = streamingPlatform === id;
                const platformIndex = platformIds.indexOf(id);
                const currentStreamingIndex = platformIds.indexOf(streamingPlatform || 'linkedin');
                const isCompleted = hasContent && !isCurrent;
                
                return (
                    <div key={id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2 relative">
                            <motion.div 
                                animate={isCurrent ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 10px rgba(59,130,246,0.5)", "0 0 0px rgba(0,0,0,0)"] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={cn(
                                    "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10",
                                    isCompleted ? `${config.bg} border-emerald-500` : 
                                    isCurrent ? `bg-primary border-primary` : 
                                    "border-zinc-300 dark:border-zinc-700 bg-transparent"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-2.5 w-2.5 text-emerald-500" />
                                ) : isCurrent ? (
                                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                                ) : null}
                            </motion.div>
                            <span className={cn(
                                "absolute top-7 whitespace-nowrap text-[9px] font-bold uppercase tracking-tighter transition-colors duration-300",
                                isCurrent ? "text-primary" : isCompleted ? "text-emerald-500" : "text-muted-foreground/40"
                            )}>
                                {config.name}
                            </span>
                        </div>
                        {idx < platformIds.length - 1 && (
                            <div className="flex-1 mx-2 h-[2px] bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                                {platformIndex < currentStreamingIndex && (
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        className={cn("h-full", isCompleted ? "bg-emerald-500" : "bg-primary")}
                                    />
                                )}
                                {platformIndex >= currentStreamingIndex && (
                                    <div className="absolute inset-0 border-t border-dashed border-zinc-300 dark:border-zinc-700 h-[1px]" />
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(val) => {
        setActiveTab(val);
        if (isStreaming) userOverrideRef.current = true;
      }} className="w-full">
        <TabsList className="flex w-full h-auto p-1.5 bg-muted/40 rounded-2xl mb-8 gap-2 border border-border/50 overflow-x-auto no-scrollbar">
          {platformIds.map((id) => {
            const config = PLATFORM_CONFIG[id];
            const hasContent = (content[id]?.length ?? 0) > 0;
            const isCurrent = isStreaming && streamingPlatform === id;
            const isCompleted = completedPlatforms.includes(id);
            const isWaiting = isStreaming && !hasContent && !isCurrent;
            const isIdle = !isStreaming && !hasContent;

            return (
              <TabsTrigger 
                key={id} 
                value={id}
                disabled={isIdle}
                className={cn(
                  "relative flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl transition-all duration-300 group min-w-[120px]",
                  "data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-lg",
                  isCurrent && "animate-[pulse_2s_infinite] shadow-[0_0_15px_-5px] shadow-primary/30",
                  id === 'instagram' && "data-[state=active]:ring-2 data-[state=active]:ring-transparent data-[state=active]:before:absolute data-[state=active]:before:inset-[-2px] data-[state=active]:before:rounded-[14px] data-[state=active]:before:bg-gradient-to-tr data-[state=active]:before:from-[#f09433] data-[state=active]:before:via-[#e6683c] data-[state=active]:before:to-[#bc1888] data-[state=active]:before:-z-10",
                  isWaiting ? "opacity-50" : isIdle ? "opacity-40" : "opacity-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    config.color, 
                    "transition-transform group-hover:scale-110 group-data-[state=active]:scale-110",
                    isWaiting && "grayscale"
                  )}>
                    {config.icon}
                  </span>
                  <span className={cn(
                    "text-sm font-semibold whitespace-nowrap",
                    isWaiting && "text-muted-foreground/60"
                  )}>
                    {config.name}
                  </span>
                </div>
                
                {activeTab === id && (
                  <motion.div 
                     layoutId="active-pill-accent"
                     className={cn("absolute bottom-1 left-4 right-4 h-0.5 rounded-full", config.accent)}
                  />
                )}

                <div className="absolute top-2 right-2">
                  {isCurrent ? (
                      <div className="flex items-center gap-0.5 h-3">
                        <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className={cn("w-0.5 rounded-full", config.accent)} />
                        <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className={cn("w-0.5 rounded-full", config.accent)} />
                        <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className={cn("w-0.5 rounded-full", config.accent)} />
                      </div>
                  ) : isCompleted ? (
                      <div className="bg-emerald-500 rounded-full p-0.5 shadow-sm">
                          <Check className="h-2 w-2 text-white" />
                      </div>
                  ) : null}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          {platformIds.map((id) => {
            const config = PLATFORM_CONFIG[id];
            return (
              <TabsContent key={id} value={id} className="mt-0 focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card className={cn(
                    "overflow-hidden border-none shadow-2xl relative bg-white dark:bg-zinc-950",
                    "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:z-20",
                    id === 'linkedin' && "before:bg-[#0077B5]",
                    id === 'twitter' && "before:bg-black dark:before:bg-white",
                    id === 'instagram' && "before:bg-gradient-to-b before:from-[#f09433] before:via-[#e6683c] before:to-[#bc1888]",
                    id === 'peerlist' && "before:bg-[#00AA45]"
                )}>
                  {isStreaming && streamingPlatform === id && (
                     <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                        <div className="w-[200%] h-full absolute top-0 -left-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.03),transparent)] dark:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.01),transparent)] animate-[shimmer_3s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
                     </div>
                  )}
                  
                  <CardHeader className="flex flex-row items-center justify-between py-5 px-6 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl", config.bg, config.color)}>
                            {config.icon}
                        </div>
                        <div>
                            <CardTitle className="text-base font-bold">{config.name} Content</CardTitle>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">AI Generated Adaptation</p>
                        </div>
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(String(content[id] || ""), id)}
                      disabled={!(content[id])}
                      className="gap-2 h-9 px-4 rounded-xl font-bold bg-white dark:bg-zinc-900 shadow-sm border border-border/50 hover:shadow-md transition-all active:scale-95 group"
                    >
                      <AnimatePresence mode="wait">
                        {copied === id ? (
                           <motion.div
                             key="check"
                             initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                             animate={{ scale: 1, rotate: 0, opacity: 1 }}
                             className="flex items-center gap-2"
                           >
                             <Check className="h-4 w-4 text-emerald-500" />
                             <span className="text-emerald-600 dark:text-emerald-400">{config.name} Copied!</span>
                           </motion.div>
                        ) : (
                           <motion.div
                             key="copy"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="flex items-center gap-2"
                           >
                             <Copy className="h-4 w-4 group-hover:text-primary transition-colors" />
                             <span>Copy Post</span>
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="p-6 md:p-8 min-h-[350px] relative">
                      {content[id as keyof ContentResponse] ? (
                        <div className="relative z-10 transition-all">
                            {/* Mock Platform Header */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm", config.accent)}>
                                    P
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-sm">PostBloom AI</span>
                                        <div className="h-3 w-3 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Check className="h-2 w-2 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <span>Just now</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-0.5">
                                            {config.icon}
                                            <span>{config.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FormattedText 
                                text={displayedContents[id] || ""} 
                                className="text-lg md:text-xl leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans tracking-tight"
                            />
                            {isStreaming && streamingPlatform === id && (
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className={cn("inline-block w-1.5 h-6 ml-1 translate-y-1 rounded-full", config.accent)}
                                />
                            )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-6">
                            {isStreaming ? (
                                <div className="w-full max-w-sm px-6">
                                    <ThinkingPhase 
                                      platformName={config.name} 
                                      isCurrent={streamingPlatform === id || activeTab === id} 
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-40">
                                    <LayoutPanelLeft className="h-12 w-12" />
                                    <p className="text-sm font-medium italic">Select a platform to generate</p>
                                </div>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Character Limits & Stats */}
                    {config.characterLimit && (content[id]) && (
                      <div className="px-8 py-6 bg-zinc-50/80 dark:bg-zinc-900/60 border-t border-border/40">
                          <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Character Audit</span>
                                  {String(content[id]).length <= config.characterLimit ? (
                                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/20">
                                        <Check className="h-2.5 w-2.5" />
                                        <span>Within limit</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full text-[9px] font-bold border border-red-500/20">
                                        <Info className="h-2.5 w-2.5" />
                                        <span>Over limit</span>
                                    </div>
                                  )}
                              </div>
                              <span className={cn(
                                  "text-xs font-mono font-bold px-2 py-0.5 rounded-md",
                                  String(content[id] || "").length > config.characterLimit 
                                    ? "text-red-500" 
                                    : "text-emerald-500"
                              )}>
                                  {String(content[id] || "").length} <span className="text-muted-foreground/50 font-sans">/</span> {config.characterLimit}
                              </span>
                          </div>
                          
                          {/* Segmented Progress Bar */}
                          <div className="flex gap-1 h-1.5 w-full mb-6">
                              {[...Array(10)].map((_, i) => {
                                  const limit = config.characterLimit || 280;
                                  const progress = (String(content[id]).length / limit) * 10;
                                  let bgColor = "bg-zinc-200 dark:bg-zinc-800";
                                  if (i < progress) {
                                      if (progress > 10) bgColor = "bg-red-500";
                                      else if (progress > 8) bgColor = "bg-amber-500";
                                      else bgColor = i === 9 ? "bg-amber-500" : "bg-emerald-500";
                                  }
                                  return (
                                      <motion.div 
                                          key={i}
                                          initial={{ scaleX: 0 }}
                                          animate={{ scaleX: 1 }}
                                          transition={{ delay: i * 0.05 }}
                                          className={cn("flex-1 rounded-full", bgColor)}
                                      />
                                  );
                              })}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                               <div className={cn("text-[9px] font-bold uppercase tracking-wider border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-colors", 
                                  id === 'linkedin' ? "bg-[#0077B5]/5 border-[#0077B5]/20 text-[#0077B5]" : "bg-zinc-100 dark:bg-zinc-800 border-border"
                               )}>
                                  <div className={cn("h-1 w-1 rounded-full", id === 'linkedin' ? "bg-[#0077B5]" : "bg-zinc-400")} />
                                  Professional Tone: Active
                              </div>
                              <div className={cn("text-[9px] font-bold uppercase tracking-wider border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-colors", 
                                  id === 'peerlist' ? "bg-[#00AA45]/5 border-[#00AA45]/20 text-[#00AA45]" : "bg-zinc-100 dark:bg-zinc-800 border-border"
                               )}>
                                  <div className={cn("h-1 w-1 rounded-full", id === 'peerlist' ? "bg-[#00AA45]" : "bg-zinc-400")} />
                                  Native Formatting: Enabled
                              </div>
                          </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            );
          })}
        </AnimatePresence>
      </Tabs>

      {!isStreaming && content.linkedin && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-10 border-t border-border/40"
        >
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] p-6 border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform">
                        <LayoutPanelLeft className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">Export All Variants</h4>
                        <p className="text-sm text-muted-foreground">Ready to post across multiple platforms</p>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-2 ml-4">
                        {platformIds.map((id) => {
                            const config = PLATFORM_CONFIG[id];
                            return (
                                <div key={id} className={cn("h-8 w-8 rounded-lg flex items-center justify-center border border-border/40 bg-white dark:bg-zinc-900 shadow-sm", config.color)}>
                                    {config.icon}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Button
                    onClick={async () => {
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
                    }}
                    className="relative min-w-[180px] h-14 rounded-2xl font-bold text-base gap-3 shadow-xl hover:shadow-primary/20 transition-all active:scale-95 px-8"
                >
                    <AnimatePresence mode="wait">
                        {copied === 'all' ? (
                            <motion.div 
                                key="success"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <Check className="h-5 w-5" />
                                <span>Copied All!</span>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="default"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <Copy className="h-5 w-5" />
                                <span>Copy to Clipboard</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </div>
        </motion.div>
      )}
    </div>
  );
}