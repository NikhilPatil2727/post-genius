import { handleRouteError } from '@/lib/api-route';
import { apiSuccess } from '@/lib/api-response';
import { getCurrentUserSummary } from '@/modules/auth/server';

export async function GET() {
  try {
    const summary = await getCurrentUserSummary();
    return apiSuccess(summary);
  } catch (error) {
    return handleRouteError(error, 'Auth summary route error:', 'Failed to load auth state.');
  }
}
