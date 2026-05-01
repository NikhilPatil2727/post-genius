import { apiError, apiSuccess } from '@/lib/api-response';
import { contentGenerationSchema } from '@/lib/schemas';
import { syncCurrentUser } from '@/modules/auth/server';
import { generatePostContent } from '@/modules/posts/server';

export async function POST(request: Request) {
  try {
    const currentUser = await syncCurrentUser();
    if (!currentUser) {
      return apiError('Please sign in to generate content.', 401);
    }

    const payload = await request.json();
    const parsed = contentGenerationSchema.safeParse(payload);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid request body.', 400);
    }

    const content = await generatePostContent(parsed.data);
    return apiSuccess({ content });
  } catch (error) {
    console.error('Post generation route error:', error);
    return apiError(error instanceof Error ? error.message : 'Failed to generate content.', 500);
  }
}
