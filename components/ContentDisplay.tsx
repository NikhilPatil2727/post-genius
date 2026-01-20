'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Removed brand icons from lucide-react, kept utility icons
import { Copy, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormattedText } from './FormattedText'; 
import type { ContentResponse, Platform } from '@/types';

// New Real Brand Icons
import { FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiPeerlist } from "react-icons/si";

interface ContentDisplayProps {
  content: ContentResponse;
}

export function ContentDisplay({ content }: ContentDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, platform: string) => {
    // Strip markdown asterisks for clipboard copy if you prefer clean text
    const cleanText = text.replace(/\*\*/g, '');
    await navigator.clipboard.writeText(cleanText);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const platforms: { 
    id: Platform; 
    name: string; 
    content: string; 
    icon: React.ReactNode;
    color: string;
    bg: string;
    characterLimit?: number;
  }[] = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      content: content.linkedin, 
      icon: <FaLinkedin className="h-4 w-4" />,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      characterLimit: 3000
    },
    { 
      id: 'twitter', 
      name: 'X (Twitter)', 
      content: content.twitterShort, 
      icon: <FaXTwitter className="h-4 w-4" />,
      color: "text-black dark:text-white", // Updated color for X branding
      bg: "bg-gray-50 dark:bg-gray-900/20",
      characterLimit: 280
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      content: content.instagram, 
      icon: <FaInstagram className="h-4 w-4" />,
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-900/20",
      characterLimit: 2200
    },
    { 
      id: 'peerlist', 
      name: 'Peerlist', 
      content: content.peerlist, 
      icon: <SiPeerlist className="h-4 w-4" />,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Master Strategy / Blog Post Content */}
      <Card className="border-l-4 border-l-primary shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileText className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Foundation</span>
          </div>
          <CardTitle className="text-xl">Master Content Strategy</CardTitle>
          <p className="text-sm text-muted-foreground">
            The core message expanded. Use this for blogs, newsletters, or long-form posts.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
             <FormattedText text={content.masterContent} />
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(content.masterContent, 'master')}
              className="gap-2"
            >
              {copied === 'master' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === 'master' ? 'Copied' : 'Copy Text'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Platform Specific Outputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                Social Adaptations
            </h3>
        </div>

        <Tabs defaultValue="linkedin" className="w-full">
          <TabsList className="w-full flex h-auto p-1 bg-muted/50 rounded-xl mb-4 overflow-x-auto justify-start">
            {platforms.map((p) => (
              <TabsTrigger 
                key={p.id} 
                value={p.id}
                className="flex-1 min-w-[100px] py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className={p.color}>{p.icon}</span>
                  <span>{p.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id} className="mt-0">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                   <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-md ${platform.bg} ${platform.color}`}>
                            {platform.icon}
                        </div>
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">{platform.name} Post</CardTitle>
                        </div>
                   </div>
                   <Button
                      variant="default"
                      size="sm"
                      onClick={() => copyToClipboard(platform.content, platform.name)}
                      className="gap-2"
                    >
                      {copied === platform.name ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === platform.name ? 'Copied' : 'Copy'}
                    </Button>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {/* The Post Content Preview */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 p-5">
                    <FormattedText 
                        text={platform.content} 
                        className="text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  {/* Character Limits & Metadata */}
                  {platform.characterLimit && (
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-muted-foreground font-medium">Character Limit</span>
                                <span className={platform.content.length > platform.characterLimit ? "text-red-500 font-bold" : "text-green-600 dark:text-green-400"}>
                                    {platform.content.length} / {platform.characterLimit}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-500 ${
                                        platform.content.length > platform.characterLimit ? 'bg-red-500' : 'bg-primary'
                                    }`}
                                    style={{ width: `${Math.min((platform.content.length / platform.characterLimit) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                  )}

                  {/* Platform Specific Hints */}
                  {platform.id === 'instagram' && (
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        💡 Tip: Add the hashtags in the first comment for cleaner aesthetics.
                      </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="pt-4 border-t flex justify-center">
         <Button
            variant="ghost"
            onClick={async () => {
              const allContent = [
                 `--- MASTER CONTENT ---\n${content.masterContent}\n`,
                 ...platforms.map(p => `--- ${p.name.toUpperCase()} ---\n${p.content}\n`)
              ].join('\n');
              // Strip markdown for bulk copy
              await navigator.clipboard.writeText(allContent.replace(/\*\*/g, ''));
              setCopied('all');
              setTimeout(() => setCopied(null), 2000);
            }}
            className="text-muted-foreground hover:text-foreground"
         >
            {copied === 'all' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy Everything to Clipboard
         </Button>
      </div>
    </div>
  );
}