export type ContentRequest = {
  mode: 'topic' | 'rewrite' | 'youtube';
  topic?: string;
  text?: string;
  youtubeUrl?: string;
  tone?: string;
  audience?: string;
};

export type ContentResponse = {
  linkedin: string;
  twitter: string;
  instagram: string;
  peerlist: string;
};

export type Platform = 'linkedin' | 'twitter' | 'instagram' | 'peerlist';

export type OptimizationCategory =
  | 'hookStrength'
  | 'readability'
  | 'ctaEffectiveness'
  | 'engagementPotential'
  | 'platformFit'
  | 'sentenceStructure'
  | 'emojiBalance'
  | 'viralityPotential'
  | 'emotionalImpact'
  | 'audienceRetention'
  | 'contentRichness'
  | 'scrollStoppingQuality';

export type PostOptimizationAnalysis = {
  scores: Record<OptimizationCategory, number>;
  overallScore: number;
  summary: string;
  topWeaknesses: string[];
  suggestions: string[];
};

export type YouTubeToPostActionResult =
  | {
      success: true;
      content: ContentResponse;
      transcript: {
        sourceUrl: string;
        segmentCount: number;
        textLength: number;
      };
    }
  | {
      success: false;
      error: string;
    };
