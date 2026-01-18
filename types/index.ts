export type ContentRequest = {
  mode: 'topic' | 'rewrite';
  topic?: string;
  text?: string;
  tone?: string;
  audience?: string;
};

export type ContentResponse = {
  masterContent: string;
  linkedin: string;
  twitterShort: string;
  twitterThread: string[];
  instagram: string;
  peerlist: string;
};

export type Platform = 'linkedin' | 'twitter' | 'instagram' | 'peerlist';