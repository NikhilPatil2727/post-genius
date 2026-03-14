"use client";

import { useState } from "react";
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
import { Loader2, PenTool, RefreshCw, Sparkles, Target, Zap } from "lucide-react";
import type { ContentRequest } from "@/types";
import { cn } from "@/lib/utils";

interface GeneratorFormProps {
  onSubmit: (data: ContentRequest) => void;
  loading: boolean;
}

const TONES = ["professional", "casual", "friendly", "authoritative", "enthusiastic", "conversational", "educational", "inspirational"];
const AUDIENCES = ["general", "business", "tech", "creatives", "entrepreneurs", "marketers", "developers", "students"];

export default function GeneratorForm({
  onSubmit,
  loading,
}: GeneratorFormProps) {
  const [mode, setMode] = useState<"topic" | "rewrite">("topic");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ContentRequest = { mode, tone, audience };
    if (mode === "topic") data.topic = topic;
    else data.text = text;
    onSubmit(data);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/50 via-primary to-primary/50 z-10" />
      
      {/* Top Header - flex-shrink: 0 */}
      <div className="flex-shrink-0 pt-6 pb-4 px-6 border-b border-border/40">
        <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Zap className="h-3 w-3" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">Configure</CardTitle>
        </div>
        <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Define your strategy</CardDescription>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden h-full">
        {/* Middle Fields - flex: 1, overflow-y-auto */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 form-scrollbar">
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "topic" | "rewrite")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full h-10 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg mb-4">
                <TabsTrigger value="topic" className="flex items-center gap-2 rounded-md font-bold text-xs transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                   <PenTool className="h-3 w-3" /> Topic
                </TabsTrigger>
                <TabsTrigger value="rewrite" className="flex items-center gap-2 rounded-md font-bold text-xs transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                   <RefreshCw className="h-3 w-3" /> Rewrite
                </TabsTrigger>
              </TabsList>

              <TabsContent value="topic" className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                      <Sparkles className="h-2.5 w-2.5" /> Core Concept
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
                  <Label htmlFor="text" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                      <PenTool className="h-2.5 w-2.5" /> Raw Thoughts
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
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Zap className="h-2.5 w-2.5" /> Voice Tone
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
                <Label htmlFor="audience" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Target className="h-2.5 w-2.5" /> Audience
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
        <div className="flex-shrink-0 px-[18px] py-[14px] border-t border-border/40 bg-zinc-50 dark:bg-zinc-950/20 z-10 w-full">
            <Button 
                type="submit" 
                className={cn(
                    "w-full h-11 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group relative",
                    loading ? "opacity-90" : "hover:shadow-xl hover:shadow-primary/30"
                )}
                disabled={loading}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                        <span>Generate Content</span>
                    </div>
                )}
            </Button>
        </div>
      </form>
      <style dangerouslySetInnerHTML={{__html:`
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