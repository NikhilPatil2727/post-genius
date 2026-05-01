import { apiError, apiSuccess } from '@/lib/api-response';
import { syncCurrentUser } from '@/modules/auth/server';

export async function POST() {
  try {
    const user = await syncCurrentUser();

    if (!user) {
      return apiError('No authenticated user.', 401);
    }

    return apiSuccess({ user });
  } catch (error) {
    console.error('User onboarding error:', error);
    return apiError('User onboarding failed.', 500);
  }
}
