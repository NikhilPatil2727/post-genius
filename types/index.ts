export type ContentTemplate =
  | 'general'
  | 'lessons_learned'
  | 'mistake_post'
  | 'build_in_public'
  | 'startup_story'
  | 'thread_breakdown';

export type ContentRequest = {
  mode: 'topic' | 'rewrite' | 'youtube';
  topic?: string;
  text?: string;
  youtubeUrl?: string;
  tone?: string;
  audience?: string;
  template?: ContentTemplate;
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
