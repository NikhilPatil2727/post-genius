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

  const platforms: { id: Platform; name: string; content: string | string[]; icon: React.ReactNode }[] = [
    { id: 'linkedin', name: 'LinkedIn', content: content.linkedin, icon: <PlatformIcons platform="linkedin" /> },
    { id: 'twitter', name: 'Twitter (Short)', content: content.twitterShort, icon: <PlatformIcons platform="twitter" /> },
    { id: 'twitter', name: 'Twitter Thread', content: content.twitterThread, icon: <PlatformIcons platform="twitter" /> },
    { id: 'instagram', name: 'Instagram', content: content.instagram, icon: <PlatformIcons platform="instagram" /> },
    { id: 'peerlist', name: 'Peerlist', content: content.peerlist, icon: <PlatformIcons platform="peerlist" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Master Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯 Master Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{content.masterContent}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => copyToClipboard(content.masterContent, 'master')}
          >
            {copied === 'master' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy Master Content
          </Button>
        </CardContent>
      </Card>

      {/* Platform Variants */}
      <Tabs defaultValue="linkedin" className="w-full">
        <TabsList className="grid grid-cols-5">
          {platforms.map((platform) => (
            <TabsTrigger key={platform.name} value={platform.id + platform.name}>
              <div className="flex items-center gap-2">
                {platform.icon}
                <span className="hidden sm:inline">{platform.name.split(' ')[0]}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform.name} value={platform.id + platform.name}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {platform.icon}
                    {platform.name}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      Array.isArray(platform.content) 
                        ? platform.content.join('\n\n') 
                        : platform.content,
                      platform.name
                    )}
                  >
                    {copied === platform.name ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(platform.content) ? (
                  <div className="space-y-4">
                    {platform.content.map((tweet, index) => (
                      <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Twitter className="h-4 w-4" />
                          <span className="text-sm font-medium">Tweet {index + 1}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{tweet}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          {tweet.length}/280 characters
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap mb-4">{platform.content}</p>
                    <div className="text-sm text-gray-500">
                      {platform.content.length} characters
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}