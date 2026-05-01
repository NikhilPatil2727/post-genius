import { z } from 'zod';

import { apiError } from '@/lib/api-response';
import { syncCurrentUser } from '@/modules/auth/server';

type ApiErrorResponse = ReturnType<typeof apiError>;

type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof syncCurrentUser>>>;

export async function requireCurrentUser(
  unauthorizedMessage: string
): Promise<
  | { currentUser: AuthenticatedUser; errorResponse?: never }
  | { currentUser?: never; errorResponse: ApiErrorResponse }
> {
  const currentUser = await syncCurrentUser();

  if (!currentUser) {
    return { errorResponse: apiError(unauthorizedMessage, 401) };
  }

  return { currentUser };
}

export async function parseRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<
  | { data: T; errorResponse?: never }
  | { data?: never; errorResponse: ApiErrorResponse }
> {
  const payload = await request.json();
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return {
      errorResponse: apiError(parsed.error.issues[0]?.message || 'Invalid request body.', 400),
    };
  }

  return { data: parsed.data };
}

export async function getRequiredRouteParam(
  params: Promise<Record<string, string | undefined>>,
  key: string,
  label = key
):
  Promise<
    | { value: string; errorResponse?: never }
    | { value?: never; errorResponse: ApiErrorResponse }
  > {
  const value = (await params)[key]?.trim();

  if (!value) {
    return { errorResponse: apiError(`${label} is required.`, 400) };
  }

  return { value };
}

export function handleRouteError(error: unknown, logLabel: string, fallbackMessage: string) {
  console.error(logLabel, error);

  return apiError(error instanceof Error ? error.message : fallbackMessage, 500);
}
