import { revalidatePath } from 'next/cache';

import { handleRouteError, parseRequestBody, requireCurrentUser } from '@/lib/api-route';
import { apiSuccess } from '@/lib/api-response';
import { savePostSchema } from '@/lib/schemas';
import { getPostsForUser, savePostForUser } from '@/modules/posts/server';

export async function GET() {
  try {
    const auth = await requireCurrentUser('Please sign in to view your posts.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const posts = await getPostsForUser(auth.currentUser.clerkId);
    return apiSuccess({ posts });
  } catch (error) {
    return handleRouteError(error, 'Error fetching dashboard posts:', 'Failed to load posts.');
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireCurrentUser('Please sign in to save your post.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const body = await parseRequestBody(request, savePostSchema);
    if ('errorResponse' in body) {
      return body.errorResponse;
    }

    const post = await savePostForUser(auth.currentUser.clerkId, body.data);

    revalidatePath('/admin/generate');
    revalidatePath('/admin');

    return apiSuccess({ post }, 201);
  } catch (error) {
    return handleRouteError(error, 'Post save route error:', 'Failed to save generated content.');
  }
}
