import { revalidatePath } from 'next/cache';

import { apiError, apiSuccess } from '@/lib/api-response';
import { savePostSchema } from '@/lib/schemas';
import { syncCurrentUser } from '@/modules/auth/server';
import { getPostsForUser, savePostForUser } from '@/modules/posts/server';

export async function GET() {
  try {
    const currentUser = await syncCurrentUser();
    if (!currentUser) {
      return apiError('Please sign in to view your posts.', 401);
    }

    const posts = await getPostsForUser(currentUser.clerkId);
    return apiSuccess({ posts });
  } catch (error) {
    console.error('Error fetching dashboard posts:', error);
    return apiError('Failed to load posts.', 500);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await syncCurrentUser();
    if (!currentUser) {
      return apiError('Please sign in to save your post.', 401);
    }

    const payload = await request.json();
    const parsed = savePostSchema.safeParse(payload);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid request body.', 400);
    }

    const post = await savePostForUser(currentUser.clerkId, parsed.data);

    revalidatePath('/admin/generate');
    revalidatePath('/admin');

    return apiSuccess({ post }, 201);
  } catch (error) {
    console.error('Post save route error:', error);
    return apiError(error instanceof Error ? error.message : 'Failed to save generated content.', 500);
  }
}
