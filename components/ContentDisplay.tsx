'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Check, Twitter, Linkedin, Instagram, Users } from 'lucide-react';
import { Button } from './ui/button';
import { PlatformIcons } from './PlatformIcons';
import type { ContentResponse, Platform } from '@/types';

interface ContentDisplayProps {
  content: ContentResponse;
}

export function ContentDisplay({ content }: ContentDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, platform: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const platforms: { 
    id: Platform; 
    name: string; 
    content: string; 
    icon: React.ReactNode;
    characterLimit?: number;
    description?: string;
  }[] = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      content: content.linkedin, 
      icon: <PlatformIcons platform="linkedin" />,
      description: 'Professional tone, short paragraphs, 3 hashtags'
    },
    { 
      id: 'twitter', 
      name: 'Twitter (Short)', 
      content: content.twitterShort, 
      icon: <PlatformIcons platform="twitter" />,
      characterLimit: 280,
      description: 'Strong hook, clear message, max 280 characters'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      content: content.instagram, 
      icon: <PlatformIcons platform="instagram" />,
      characterLimit: 2200,
      description: 'Strong hook in first 125 chars, friendly tone, 5 hashtags'
    },
    { 
      id: 'peerlist', 
      name: 'Peerlist', 
      content: content.peerlist, 
      icon: <PlatformIcons platform="peerlist" />,
      description: 'Professional and concise, max 2000 characters'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Master Content */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Master Content</h2>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                600–900 words | Value-driven | Clear takeaway
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="rounded-lg border p-6 bg-background/50">
              <p className="whitespace-pre-wrap leading-relaxed">{content.masterContent}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              {content.masterContent.split(/\s+/).length} words •{' '}
              {content.masterContent.length} characters
            </div>
            <Button
              variant="default"
              size="lg"
              className="gap-2"
              onClick={() => copyToClipboard(content.masterContent, 'master')}
            >
              {copied === 'master' ? (
                <>
                  <Check className="h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copy Master Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Variants */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Platform Variants</h3>
          <p className="text-muted-foreground">
            Optimized content for each social platform
          </p>
        </div>
        
        <Tabs defaultValue="linkedin" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-4 mb-8">
            {platforms.map((platform) => (
              <TabsTrigger 
                key={platform.name} 
                value={platform.id}
                className="flex flex-col h-auto py-3 data-[state=active]:bg-primary/10"
              >
                <div className="flex items-center gap-2 mb-1">
                  {platform.icon}
                  <span className="font-semibold">{platform.name}</span>
                </div>
                {platform.characterLimit && (
                  <span className="text-xs text-muted-foreground">
                    Max {platform.characterLimit} chars
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        {platform.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{platform.name}</CardTitle>
                        {platform.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {platform.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        platform.content.length > (platform.characterLimit || Infinity)
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {platform.content.length}/{platform.characterLimit || '∞'} chars
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => copyToClipboard(platform.content, platform.name)}
                      >
                        {copied === platform.name ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`rounded-lg border p-6 ${
                    platform.id === 'instagram' 
                      ? 'bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20'
                      : platform.id === 'twitter'
                      ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
                      : platform.id === 'linkedin'
                      ? 'bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'
                      : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20'
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{platform.content}</p>
                    </div>
                    
                    {/* Platform-specific formatting hints */}
                    {platform.id === 'instagram' && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {platform.content.match(/#[\w]+/g)?.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-white/50 dark:bg-black/30 rounded text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {platform.id === 'linkedin' && platform.content.match(/#[\w]+/g) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-muted-foreground mb-2">Hashtags:</p>
                        <div className="flex flex-wrap gap-2">
                          {platform.content.match(/#[\w]+/g)?.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Character count with visual indicator */}
                  {platform.characterLimit && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Character usage</span>
                        <span className={`font-medium ${
                          platform.content.length > platform.characterLimit
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {platform.content.length}/{platform.characterLimit}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            platform.content.length > platform.characterLimit
                              ? 'bg-red-500'
                              : platform.content.length > platform.characterLimit * 0.9
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min((platform.content.length / platform.characterLimit) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      {platform.content.length > platform.characterLimit && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                          ⚠️ Exceeds {platform.name} character limit by {platform.content.length - platform.characterLimit} characters
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Bulk Copy Option */}
      <Card>
        <CardHeader>
          <CardTitle>Copy All Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Copy all platform content at once for easy distribution
            </p>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={async () => {
                const allContent = [
                  `🎯 MASTER CONTENT\n${content.masterContent}\n\n`,
                  ...platforms.map(p => 
                    `📱 ${p.name.toUpperCase()}\n${p.content}\n\n`
                  )
                ].join('---\n\n');
                
                await copyToClipboard(allContent, 'all');
              }}
            >
              {copied === 'all' ? (
                <>
                  <Check className="h-5 w-5" />
                  All Content Copied!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copy All Platform Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}