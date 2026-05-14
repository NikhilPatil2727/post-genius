import { handleRouteError, parseRequestBody, requireCurrentUser } from '@/lib/api-route';
import { apiSuccess } from '@/lib/api-response';
import { dailyAiLimitExceededResponse, reserveDailyAiAction } from '@/lib/ai-rate-limit';
import { optimizePostSchema } from '@/lib/schemas';
import { analyzePostContent } from '@/modules/posts/server';

export async function POST(request: Request) {
  try {
    const auth = await requireCurrentUser('Please sign in to optimize posts.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const body = await parseRequestBody(request, optimizePostSchema);
    if ('errorResponse' in body) {
      return body.errorResponse;
    }

    const rateLimit = await reserveDailyAiAction(auth.currentUser.id);
    if (!rateLimit.allowed) {
      return dailyAiLimitExceededResponse();
    }

    const analysis = await analyzePostContent(body.data);
    return apiSuccess({ analysis });
  } catch (error) {
    return handleRouteError(error, 'Post optimization route error:', 'Failed to optimize post.');
  }
}
