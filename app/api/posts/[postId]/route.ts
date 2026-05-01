import { revalidatePath } from 'next/cache';

import {
  getRequiredRouteParam,
  handleRouteError,
  requireCurrentUser,
} from '@/lib/api-route';
import { apiError, apiSuccess } from '@/lib/api-response';
import { deletePostForUser, getPostForUser } from '@/modules/posts/server';

type RouteContext = {
  params: Promise<{
    postId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const auth = await requireCurrentUser('Please sign in to open this post.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const postId = await getRequiredRouteParam(context.params, 'postId', 'Post id');
    if ('errorResponse' in postId) {
      return postId.errorResponse;
    }

    const post = await getPostForUser(auth.currentUser.clerkId, postId.value);
    if (!post) {
      return apiError('Post not found.', 404);
    }

    return apiSuccess({ post });
  } catch (error) {
    return handleRouteError(error, 'Error fetching post:', 'Failed to load post.');
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const auth = await requireCurrentUser('Please sign in to delete this post.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const postId = await getRequiredRouteParam(context.params, 'postId', 'Post id');
    if ('errorResponse' in postId) {
      return postId.errorResponse;
    }

    const deleteResult = await deletePostForUser(auth.currentUser.clerkId, postId.value);
    if (deleteResult.count === 0) {
      return apiError('Post not found or access denied.', 404);
    }

    revalidatePath('/admin/generate');
    revalidatePath('/admin');

    return apiSuccess({});
  } catch (error) {
    return handleRouteError(error, 'Error deleting post:', 'Failed to delete post.');
  }
}
