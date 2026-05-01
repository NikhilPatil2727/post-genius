import { apiSuccess } from '@/lib/api-response';
import { getCurrentUserSummary } from '@/modules/auth/server';

export async function GET() {
  const summary = await getCurrentUserSummary();
  return apiSuccess(summary);
}
