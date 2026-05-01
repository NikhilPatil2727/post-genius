import { revalidatePath } from 'next/cache';

import { apiError, apiSuccess } from '@/lib/api-response';
import { syncCurrentUser } from '@/modules/auth/server';
import { deletePostForUser, getPostForUser } from '@/modules/posts/server';

type RouteContext = {
  params: Promise<{
    postId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const currentUser = await syncCurrentUser();
    if (!currentUser) {
      return apiError('Please sign in to open this post.', 401);
    }

    const { postId } = await context.params;
    if (!postId) {
      return apiError('Post id is required.', 400);
    }

    const post = await getPostForUser(currentUser.clerkId, postId);
    if (!post) {
      return apiError('Post not found.', 404);
    }

    return apiSuccess({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return apiError('Failed to load post.', 500);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const currentUser = await syncCurrentUser();
    if (!currentUser) {
      return apiError('Please sign in to delete this post.', 401);
    }

    const { postId } = await context.params;
    if (!postId) {
      return apiError('Post id is required.', 400);
    }

    const deleteResult = await deletePostForUser(currentUser.clerkId, postId);
    if (deleteResult.count === 0) {
      return apiError('Post not found or access denied.', 404);
    }

    revalidatePath('/admin/generate');
    revalidatePath('/admin');

    return apiSuccess({});
  } catch (error) {
    console.error('Error deleting post:', error);
    return apiError('Failed to delete post.', 500);
  }
}
