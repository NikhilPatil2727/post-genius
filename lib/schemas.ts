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
