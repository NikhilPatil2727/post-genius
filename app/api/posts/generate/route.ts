import { handleRouteError, parseRequestBody, requireCurrentUser } from '@/lib/api-route';
import { apiSuccess } from '@/lib/api-response';
import { dailyAiLimitExceededResponse, reserveDailyAiAction } from '@/lib/ai-rate-limit';
import { contentGenerationSchema } from '@/lib/schemas';
import { generatePostContent } from '@/modules/posts/server';

export async function POST(request: Request) {
  try {
    const auth = await requireCurrentUser('Please sign in to generate content.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const body = await parseRequestBody(request, contentGenerationSchema);
    if ('errorResponse' in body) {
      return body.errorResponse;
    }

    const rateLimit = await reserveDailyAiAction(auth.currentUser.id, 'generate-content');
    if (!rateLimit.allowed) {
      return dailyAiLimitExceededResponse('generate-content');
    }

    const content = await generatePostContent(body.data);
    return apiSuccess({ content });
  } catch (error) {
    return handleRouteError(error, 'Post generation route error:', 'Failed to generate content.');
  }
}
