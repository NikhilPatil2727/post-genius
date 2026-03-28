export type ContentRequest = {
  mode: 'topic' | 'rewrite' | 'youtube';
  topic?: string;
  text?: string;
  youtubeUrl?: string;
  tone?: string;
  audience?: string;
  apiKey?: string;
};

export type ContentResponse = {
  // masterContent: string;
  linkedin: string;
  twitter: string;
  twitterThread?: string[];
  instagram: string;
  peerlist: string;
};

export type Platform = 'linkedin' | 'twitter' | 'instagram' | 'peerlist';

export type YouTubeGenerationRequest = {
  youtubeUrl: string;
  voice: string;
  audience: string;
  platforms: Platform[];
};

export type YouTubeGenerationData = {
  videoTitle: string;
  keySummary: string;
  posts: Partial<Record<Platform, string>>;
};

export type YouTubeGenerationResult =
  | {
      success: true;
      data: YouTubeGenerationData;
    }
  | {
      success: false;
      error: string;
    };
