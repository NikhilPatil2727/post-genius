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
    bg: string;
    border: string;
    characterLimit?: number;
    recommendedRange?: [number, number];
}> = {
    linkedin: { 
      name: 'LinkedIn', 
      icon: <FaLinkedin className="h-4 w-4" />,
      color: "text-blue-600",
      bg: "bg-blue-50/50 dark:bg-blue-900/10",
      border: "border-blue-200/50 dark:border-blue-800/50",
      characterLimit: 8000,
      recommendedRange: [1200, 8000]
    },
    twitter: { 
      name: 'X (Twitter)', 
      icon: <FaXTwitter className="h-4 w-4" />,
      color: "text-slate-900 dark:text-slate-100", 
      bg: "bg-slate-50/50 dark:bg-slate-900/10",
      border: "border-slate-200/50 dark:border-slate-800/50",
      characterLimit: 280
    },
    instagram: { 
      name: 'Instagram', 
      icon: <FaInstagram className="h-4 w-4" />,
      color: "text-pink-600",
      bg: "bg-pink-50/50 dark:bg-pink-900/10",
      border: "border-pink-200/50 dark:border-pink-800/50",
      characterLimit: 600
    },
    peerlist: { 
      name: 'Peerlist', 
      icon: <SiPeerlist className="h-4 w-4" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50 dark:bg-emerald-900/10",
      border: "border-emerald-200/50 dark:border-emerald-800/50",
      characterLimit: 2000, // User requested max 2000
    },
};

export function ContentDisplay({ content, isStreaming }: ContentDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('linkedin');
  const lastUpdateRef = useRef<Record<string, number>>({});

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

  // Automatically switch to the first platform that starts receiving content
  useEffect(() => {
    if (isStreaming) {
       for (const p of platforms) {
          if (p.content.length > 0 && !lastUpdateRef.current[p.id]) {
             setActiveTab(p.id);
             lastUpdateRef.current[p.id] = Date.now();
             break;
          }
       }
    }
    if (!isStreaming) {
        lastUpdateRef.current = {};
    }
  }, [content, isStreaming]);

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
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Streaming</span>
            </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1.5 bg-muted/40 rounded-2xl mb-8 gap-1 border border-border/50">
          {Object.entries(PLATFORM_CONFIG).map(([id, config]) => (
            <TabsTrigger 
              key={id} 
              value={id}
              disabled={!isStreaming && (!content[id as keyof ContentResponse] || content[id as keyof ContentResponse]?.length === 0)}
              className={cn(
                "relative flex items-center gap-2.5 py-3 px-4 rounded-xl transition-all duration-300",
                "data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:shadow-xl data-[state=active]:ring-1 data-[state=active]:ring-border/50",
                (isStreaming || content[id as keyof ContentResponse]) ? "opacity-100" : "opacity-40"
              )}
            >
              <span className={cn(config.color, "transition-transform group-data-[state=active]:scale-110")}>{config.icon}</span>
              <span className="text-sm font-semibold hidden sm:inline">{config.name}</span>
              <span className="text-xs font-semibold sm:hidden">{config.name.split(' ')[0]}</span>
              
              {isStreaming && (content[id as keyof ContentResponse]?.length ?? 0) > 0 && (
                  <motion.div 
                    layoutId="active-dot"
                    className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" 
                  />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {Object.entries(PLATFORM_CONFIG).map(([id, config]) => (
            <TabsContent key={id} value={id} className="mt-0 focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card className={cn(
                    "overflow-hidden border-none shadow-2xl relative bg-white/50 dark:bg-black/20 backdrop-blur-sm",
                    config.border.replace('border-', 'ring-1 ring-')
                )}>
                  <div className={cn("absolute top-0 left-0 w-full h-1", config.bg.replace('/10', '/30'))} />
                  
                  <CardHeader className="flex flex-row items-center justify-between py-6 px-6 border-b border-border/40 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-xl shadow-inner", config.bg, config.color)}>
                            {config.icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold">{config.name} Adaptation</CardTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium italic">
                                    <Info className="h-3 w-3" />
                                    {config.characterLimit ? `Constraint: ${config.characterLimit} chars max` : 'Flexible length'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(String(content[id as keyof ContentResponse] || ""), id)}
                      disabled={!(content[id as keyof ContentResponse])}
                      className="gap-2 h-10 px-4 rounded-xl font-bold bg-white dark:bg-zinc-900 shadow-sm border border-border/50 hover:shadow-md transition-all active:scale-95 group"
                    >
                      {copied === id ? (
                         <Check className="h-4 w-4 text-green-600" />
                      ) : (
                         <Copy className="h-4 w-4 group-hover:text-primary transition-colors" />
                      )}
                      <span>{copied === id ? 'Copied' : 'Copy Post'}</span>
                    </Button>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="p-8 min-h-[300px] relative">
                      {content[id as keyof ContentResponse] ? (
                        <div className="relative z-10 transition-all">
                            <FormattedText 
                                text={String(content[id as keyof ContentResponse] || "")} 
                                className="text-lg md:text-xl leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans tracking-tight"
                            />
                            {isStreaming && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="inline-block w-1.5 h-6 bg-primary ml-1 translate-y-1"
                                />
                            )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-4">
                            {isStreaming ? (
                                <div className="space-y-4 flex flex-col items-center">
                                    <div className="flex gap-1.5 items-center">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                        <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                                    </div>
                                    <p className="text-sm font-medium italic tracking-wide animate-pulse">Brainstorming for {config.name}...</p>
                                </div>
                            ) : (
                                <p className="text-sm font-medium italic">Ready to generate content.</p>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Character Limits & Stats */}
                    {config.characterLimit && (content[id as keyof ContentResponse]) && (
                      <div className="px-8 py-6 bg-zinc-50/50 dark:bg-zinc-900/40 border-t border-border/40">
                          <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  Character Audit
                                  {id === 'linkedin' && (content.linkedin.length >= 400 && content.linkedin.length <= 700) && (
                                      <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">Optimal Range</span>
                                  )}
                              </span>
                              <span className={cn(
                                  "text-xs font-mono font-bold px-2 py-0.5 rounded-md",
                                  String(content[id as keyof ContentResponse] || "").length > config.characterLimit 
                                    ? "bg-red-500/10 text-red-500" 
                                    : "bg-emerald-500/10 text-emerald-500"
                              )}>
                                  {String(content[id as keyof ContentResponse] || "").length} / {config.characterLimit}
                              </span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((String(content[id as keyof ContentResponse] || "").length / config.characterLimit) * 100, 100)}%` }}
                                  className={cn(
                                      "h-full rounded-full transition-all duration-300",
                                      String(content[id as keyof ContentResponse] || "").length > config.characterLimit ? 'bg-red-500' : 'bg-primary'
                                  )}
                              />
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                              {id === 'linkedin' && (
                                  <span className="text-[10px] font-medium text-zinc-500 border rounded-lg px-2 py-1 bg-white/50 dark:bg-black/20">
                                      Professional Tone: Active
                                  </span>
                              )}
                              {id === 'peerlist' && (
                                  <span className="text-[10px] font-medium text-zinc-500 border rounded-lg px-2 py-1 bg-white/50 dark:bg-black/20">
                                      Friendly Tone: Active
                                  </span>
                              )}
                               <span className="text-[10px] font-medium text-zinc-500 border rounded-lg px-2 py-1 bg-white/50 dark:bg-black/20">
                                  Native Formatting: Enabled
                              </span>
                          </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>

      {!isStreaming && content.linkedin && (
        <div className="pt-8 border-t border-border/40 flex flex-col items-center gap-4">
             <Button
                variant="ghost"
                onClick={async () => {
                  const allContent = Object.entries(PLATFORM_CONFIG)
                    .map(([id, config]) => content[id as keyof ContentResponse] ? `--- ${config.name.toUpperCase()} ---\n${content[id as keyof ContentResponse]}\n` : "")
                    .filter(Boolean)
                    .join('\n');
                  await navigator.clipboard.writeText(allContent.replace(/\*\*/g, ''));
                  setCopied('all');
                  setTimeout(() => setCopied(null), 2000);
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 px-8 py-8 rounded-[2rem] border border-dashed border-border group"
             >
                {copied === 'all' ? <Check className="h-4 w-4 mr-3 text-green-500" /> : <Copy className="h-4 w-4 mr-3 group-hover:text-primary transition-transform group-hover:scale-110" />}
                <div className="text-left">
                    <p className="font-bold text-base">Bulk Export</p>
                    <p className="text-xs opacity-60">Copy all platform variations to clipboard</p>
                </div>
             </Button>
        </div>
      )}
    </div>
  );
}