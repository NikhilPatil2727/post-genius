import { handleRouteError, requireCurrentUser } from '@/lib/api-route';
import { apiSuccess } from '@/lib/api-response';

export async function POST() {
  try {
    const auth = await requireCurrentUser('No authenticated user.');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    return apiSuccess({ user: auth.currentUser });
  } catch (error) {
    return handleRouteError(error, 'User onboarding error:', 'User onboarding failed.');
  }
}
