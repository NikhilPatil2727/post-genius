import { handleRouteError, parseRequestBody, requireCurrentUser } from '@/lib/api-route';
import { apiError, apiSuccess } from '@/lib/api-response';
import { dailyAiLimitExceededResponse, reserveDailyAiAction } from '@/lib/ai-rate-limit';
import { youtubeGenerationSchema } from '@/lib/schemas';
import { generateYouTubePost } from '@/modules/youtube/server';

export async function POST(request: Request) {
  try {
    const auth = await requireCurrentUser('Please sign in to generate content.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const body = await parseRequestBody(request, youtubeGenerationSchema);
    if ('errorResponse' in body) {
      return body.errorResponse;
    }

    const rateLimit = await reserveDailyAiAction(auth.currentUser.id);
    if (!rateLimit.allowed) {
      return dailyAiLimitExceededResponse();
    }

    const result = await generateYouTubePost(body.data);
    if (!result.success) {
      return apiError(result.error, 400);
    }

    return apiSuccess({
      content: result.content,
      transcript: result.transcript,
    });
  } catch (error) {
    return handleRouteError(error, 'YouTube route error:', 'Failed to process YouTube content.');
  }
}
