"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
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

    const data: ContentRequest = {
      mode,
      tone,
      audience,
    };

    if (mode === "topic") {
      data.topic = topic;
    } else {
      data.text = text;
    }

    onSubmit(data);
  };

  const tones = [
    "professional",
    "casual",
    "friendly",
    "authoritative",
    "enthusiastic",
    "conversational",
    "educational",
    "inspirational",
  ];

  const audiences = [
    "general",
    "business",
    "tech",
    "creatives",
    "entrepreneurs",
    "marketers",
    "developers",
    "students",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === "topic" ? (
            <Sparkles className="h-5 w-5" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
          Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "topic" | "rewrite")}
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="topic">Generate from Topic</TabsTrigger>
              <TabsTrigger value="rewrite">Rewrite Existing Text</TabsTrigger>
            </TabsList>

            <TabsContent value="topic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., The future of AI in marketing"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-gray-500">
                  What would you like to create content about?
                </p>
              </div>
            </TabsContent>

            <TabsContent value="rewrite" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="text">Your Content *</Label>
                <Textarea
                  id="text"
                  placeholder="Paste your existing content here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-gray-500">
                  We will  improve and optimize this content for different
                  platforms
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select
                value={audience}
                onValueChange={setAudience}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            <span>Platforms: LinkedIn, X (Twitter), Instagram, Peerlist</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
