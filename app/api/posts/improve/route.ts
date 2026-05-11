import { handleRouteError, parseRequestBody, requireCurrentUser } from '@/lib/api-route';
import { apiSuccess } from '@/lib/api-response';
import { improvePostSchema } from '@/lib/schemas';
import { improveOptimizedPostContent } from '@/modules/posts/server';

export async function POST(request: Request) {
  try {
    const auth = await requireCurrentUser('Please sign in to improve posts.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const body = await parseRequestBody(request, improvePostSchema);
    if ('errorResponse' in body) {
      return body.errorResponse;
    }

    const content = await improveOptimizedPostContent(body.data);
    return apiSuccess({ content });
  } catch (error) {
    return handleRouteError(error, 'Post improvement route error:', 'Failed to improve post.');
  }
}
