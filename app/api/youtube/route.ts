import { apiError, apiSuccess } from '@/lib/api-response';
import { youtubeGenerationSchema } from '@/lib/schemas';
import { syncCurrentUser } from '@/modules/auth/server';
import { generateYouTubePost } from '@/modules/youtube/server';

export async function POST(request: Request) {
  try {
    const currentUser = await syncCurrentUser();
    if (!currentUser) {
      return apiError('Please sign in to generate content.', 401);
    }

    const payload = await request.json();
    const parsed = youtubeGenerationSchema.safeParse(payload);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid request body.', 400);
    }

    const result = await generateYouTubePost(parsed.data);
    if (!result.success) {
      return apiError(result.error, 400);
    }

    return apiSuccess({
      content: result.content,
      transcript: result.transcript,
    });
  } catch (error) {
    console.error('YouTube route error:', error);
    return apiError('Failed to process YouTube content.', 500);
  }
}
