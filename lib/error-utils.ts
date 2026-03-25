const JSON_LIKE_ERROR = /^\s*[\[{]/;

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractMessage(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (JSON_LIKE_ERROR.test(trimmed)) {
      const parsed = safeJsonParse(trimmed);
      if (parsed) return extractMessage(parsed);
    }

    return trimmed;
  }

  if (typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;

  return (
    extractMessage(record.message) ||
    extractMessage(record.error) ||
    extractMessage(record.details) ||
    extractMessage(record.statusText) ||
    extractMessage(record.response) ||
    extractMessage(record.data) ||
    null
  );
}

export function toUserFriendlyError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  const rawMessage =
    extractMessage(error) ||
    (error instanceof Error ? error.message : null) ||
    fallback;

  const normalized = rawMessage.trim();
  const lower = normalized.toLowerCase();

  if (
    lower.includes('api key') ||
    lower.includes('authentication') ||
    lower.includes('unauthorized') ||
    lower.includes('permission denied') ||
    lower.includes('invalid key')
  ) {
    return 'Your API key looks invalid or expired. Please update it and try again.';
  }

  if (
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('too many requests') ||
    lower.includes('resource exhausted')
  ) {
    return 'Too many requests right now. Please wait a moment and try again.';
  }

  if (
    lower.includes('network') ||
    lower.includes('fetch failed') ||
    lower.includes('timed out') ||
    lower.includes('timeout') ||
    lower.includes('econnreset') ||
    lower.includes('enotfound')
  ) {
    return 'We could not connect to the server. Please check your internet connection and try again.';
  }

  if (
    lower.includes('500') ||
    lower.includes('502') ||
    lower.includes('503') ||
    lower.includes('504') ||
    lower.includes('internal server error')
  ) {
    return 'The server is having trouble right now. Please try again in a moment.';
  }

  if (JSON_LIKE_ERROR.test(normalized)) {
    return fallback;
  }

  return normalized || fallback;
}
