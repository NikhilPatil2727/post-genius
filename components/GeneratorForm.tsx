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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, PenTool, RefreshCw, Wand2 } from "lucide-react";
import type { ContentRequest } from "@/types";

interface GeneratorFormProps {
  onSubmit: (data: ContentRequest) => void;
  loading: boolean;
}

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
    <Card className="shadow-lg border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-serif">Configuration</CardTitle>
        <CardDescription>Customize your content generation parameters.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "topic" | "rewrite")}
            className="w-full "
          >
            <TabsList className="grid grid-cols-2 w-full mb-4 ">
              <TabsTrigger value="topic" className="flex items-center gap-2 cursor-pointer">
                 <PenTool className="h-4 w-4" /> New Topic
              </TabsTrigger>
              <TabsTrigger value="rewrite" className="flex items-center gap-2 cursor-pointer">
                 <RefreshCw className="h-4 w-4" /> Rewrite
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topic" className="space-y-3 mt-0">
              <div className="space-y-2">
                <Label htmlFor="topic" className="font-medium">Topic / Keyword</Label>
                <Input
                  id="topic"
                  placeholder="e.g. The impact of AI on SaaS..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required={mode === 'topic'}
                  disabled={loading}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
            </TabsContent>

            <TabsContent value="rewrite" className="space-y-3 mt-0">
              <div className="space-y-2">
                <Label htmlFor="text" className="font-medium">Source Text</Label>
                <Textarea
                  id="text"
                  placeholder="Paste your rough draft here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  required={mode === 'rewrite'}
                  disabled={loading}
                  className="bg-white dark:bg-gray-950 resize-none"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone of Voice</Label>
              <Select value={tone} onValueChange={setTone} disabled={loading}>
                <SelectTrigger className="bg-white dark:bg-gray-950 cursor-pointer">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {["professional", "casual", "friendly", "authoritative", "enthusiastic", "conversational", "educational", "inspirational"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={audience} onValueChange={setAudience} disabled={loading}>
                <SelectTrigger className="bg-white dark:bg-gray-950 cursor-pointer">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {["general", "business", "tech", "creatives", "entrepreneurs", "marketers", "developers", "students"].map((a) => (
                    <SelectItem key={a} value={a}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full font-semibold shadow-md cursor-pointer" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
               
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}