import { z } from 'zod';

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

export const contentGenerationSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('topic'),
    topic: z.string().trim().min(1, 'Please add a topic.'),
    tone: optionalTrimmedString,
    audience: optionalTrimmedString,
  }),
  z.object({
    mode: z.literal('rewrite'),
    text: z.string().trim().min(1, 'Please add text to rewrite.'),
    tone: optionalTrimmedString,
    audience: optionalTrimmedString,
  }),
]);

export const youtubeGenerationSchema = z.object({
  youtubeUrl: z.string().trim().url('Please add a valid YouTube URL.'),
  tone: optionalTrimmedString,
  audience: optionalTrimmedString,
});

export const savePostSchema = z.object({
  topic: optionalTrimmedString,
  sourceText: optionalTrimmedString,
  tone: optionalTrimmedString,
  audience: optionalTrimmedString,
  variants: z
    .array(
      z.object({
        platform: z.enum(['LINKEDIN', 'TWITTER', 'INSTAGRAM', 'PEERLIST']),
        content: z.string().trim().min(1, 'Post content cannot be empty.'),
      })
    )
    .min(1, 'At least one generated variant is required.'),
});

const optimizationScoresSchema = z.object({
  hookStrength: z.number().min(0).max(10),
  readability: z.number().min(0).max(10),
  ctaEffectiveness: z.number().min(0).max(10),
  engagementPotential: z.number().min(0).max(10),
  platformFit: z.number().min(0).max(10),
  sentenceStructure: z.number().min(0).max(10),
  emojiBalance: z.number().min(0).max(10),
  viralityPotential: z.number().min(0).max(10),
  emotionalImpact: z.number().min(0).max(10),
  audienceRetention: z.number().min(0).max(10),
  contentRichness: z.number().min(0).max(10),
  scrollStoppingQuality: z.number().min(0).max(10),
});

export const postOptimizationAnalysisSchema = z.object({
  scores: optimizationScoresSchema,
  overallScore: z.number().min(0).max(100),
  summary: z.string().trim().min(1),
  topWeaknesses: z.array(z.string().trim().min(1)).max(5),
  suggestions: z.array(z.string().trim().min(1)).max(6),
});

export const optimizePostSchema = z.object({
  content: z.string().trim().min(1, 'Post content is required.'),
  platform: z.enum(['linkedin', 'twitter', 'instagram', 'peerlist']),
});

export const improvePostSchema = optimizePostSchema.extend({
  analysis: postOptimizationAnalysisSchema,
});
