"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <Card className="overflow-hidden border-none shadow-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-[2rem]">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      
      <CardHeader className="pt-8 pb-6 px-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Configure</CardTitle>
        </div>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">Define your strategy and let AI do the heavy lifting.</CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "topic" | "rewrite")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full h-12 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl mb-6">
              <TabsTrigger value="topic" className="flex items-center gap-2 rounded-lg font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                 <PenTool className="h-4 w-4" /> Topic
              </TabsTrigger>
              <TabsTrigger value="rewrite" className="flex items-center gap-2 rounded-lg font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm">
                 <RefreshCw className="h-4 w-4" /> Rewrite
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topic" className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-3">
                <Label htmlFor="topic" className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> Core Concept
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g. The future of decentralized AI..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required={mode === 'topic'}
                  disabled={loading}
                  className="h-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-primary shadow-inner"
                />
              </div>
            </TabsContent>

            <TabsContent value="rewrite" className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-3">
                <Label htmlFor="text" className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <PenTool className="h-3 w-3" /> Raw Thoughts
                </Label>
                <Textarea
                  id="text"
                  placeholder="Paste your rough notes or a draft here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  required={mode === 'rewrite'}
                  disabled={loading}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-primary shadow-inner resize-none leading-relaxed p-4"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="space-y-3">
              <Label htmlFor="tone" className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Zap className="h-3 w-3" /> Voice Tone
              </Label>
              <Select value={tone} onValueChange={setTone} disabled={loading}>
                <SelectTrigger className="h-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1">
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="rounded-lg py-2.5 font-medium cursor-pointer">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="audience" className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Target className="h-3 w-3" /> Audience
              </Label>
              <Select value={audience} onValueChange={setAudience} disabled={loading}>
                <SelectTrigger className="h-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1">
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a} className="rounded-lg py-2.5 font-medium cursor-pointer">
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className={cn(
                "w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] relative overflow-hidden group",
                loading ? "opacity-90" : "hover:shadow-2xl hover:shadow-primary/30"
            )}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Magic...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                <span>Generate Content</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}