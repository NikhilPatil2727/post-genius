"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PenTool, RefreshCw, Video } from "lucide-react";
import type { ContentRequest } from "@/types";
import { cn } from "@/lib/utils";

interface GeneratorFormProps {
  onSubmit: (data: ContentRequest) => void;
  loading: boolean;
  initialData?: Partial<ContentRequest>;
}

const TONES = ["professional", "casual", "friendly", "authoritative", "enthusiastic", "conversational", "educational", "inspirational"];
const AUDIENCES = ["general", "business", "tech", "creatives", "entrepreneurs", "marketers", "developers", "students"];

export default function GeneratorForm({
  onSubmit,
  loading,
  initialData,
}: GeneratorFormProps) {
  const [mode, setMode] = useState<"topic" | "rewrite" | "youtube">(initialData?.mode ?? "topic");
  const [topic, setTopic] = useState(initialData?.topic ?? "");
  const [text, setText] = useState(initialData?.text ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? "");
  const [tone, setTone] = useState(initialData?.tone ?? "professional");
  const [audience, setAudience] = useState(initialData?.audience ?? "general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ContentRequest = { mode, tone, audience };
    if (mode === "topic") data.topic = topic;
    else if (mode === "rewrite") data.text = text;
    else data.youtubeUrl = youtubeUrl;
    onSubmit(data);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/50 via-primary to-primary/50 z-10" />

      {/* Top Header - flex-shrink: 0 */}
      <div className="flex-shrink-0 pt-8 pb-5 px-6 border-b border-border/40">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight font-serif italic text-zinc-900 dark:text-zinc-50">Parameters</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Define your content strategy</CardDescription>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden h-full">
        {/* Middle Fields - flex: 1, overflow-y-auto */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 form-scrollbar">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "topic" | "rewrite" | "youtube")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full h-10 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg mb-4">
              <TabsTrigger value="topic" className="flex items-center gap-2 rounded-md font-bold text-xs transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                <PenTool className="h-3 w-3" /> Topic
              </TabsTrigger>
              <TabsTrigger value="rewrite" className="flex items-center gap-2 rounded-md font-bold text-xs transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                <RefreshCw className="h-3 w-3" /> Rewrite
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2 rounded-md font-bold text-xs transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                <Video className="h-3 w-3" /> YouTube
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topic" className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Concept Source
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g. The future of AI..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required={mode === 'topic'}
                  disabled={loading}
                  className="h-10 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary shadow-inner"
                />
              </div>
            </TabsContent>

            <TabsContent value="rewrite" className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="text" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Raw Draft
                </Label>
                <Textarea
                  id="text"
                  placeholder="Paste rough notes..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  required={mode === 'rewrite'}
                  disabled={loading}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus-visible:ring-primary shadow-inner resize-none leading-relaxed p-3"
                />
              </div>
            </TabsContent>

            <TabsContent value="youtube" className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  YouTube Link
                </Label>
                <Input
                  id="youtubeUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  required={mode === 'youtube'}
                  disabled={loading}
                  className="h-10 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary shadow-inner"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Editorial Voice
              </Label>
              <Select value={tone} onValueChange={setTone} disabled={loading}>
                <SelectTrigger className="h-10 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="rounded-lg p-1 text-sm">
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="rounded-md py-1.5 font-medium cursor-pointer">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Target Audience
              </Label>
              <Select value={audience} onValueChange={setAudience} disabled={loading}>
                <SelectTrigger className="h-10 text-sm bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent className="rounded-lg p-1 text-sm">
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a} className="rounded-md py-1.5 font-medium cursor-pointer">
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Bottom Generate button - flex-shrink: 0, padding 14px 18px, border-top */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border/40 bg-zinc-50/50 dark:bg-zinc-950/20 z-10 w-full transition-all">
          <Button
            type="submit"
            className={cn(
              "w-full h-9 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[0.97] group relative overflow-hidden",
              "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:opacity-90 cursor-pointer shadow-sm",
              loading ? "opacity-70 cursor-wait" : ""
            )}
            disabled={loading}
          >
            {loading && (
              <motion.div
                className="absolute inset-0 bg-primary/5 w-[200%] z-0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
            )}
            <div className="relative flex items-center justify-center gap-2 z-10">
              {loading ? (
                <span>Crafting Content...</span>
              ) : (
                <span>Generate Content</span>
              )}
            </div>
          </Button>
        </div>
      </form>
      <style dangerouslySetInnerHTML={{
        __html: `
        .form-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .form-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .form-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(161, 161, 170, 0.2);
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
