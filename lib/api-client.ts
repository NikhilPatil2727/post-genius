type RequestJsonOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | object | null;
};

export async function requestJson<T>(input: string, init: RequestJsonOptions = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const body =
    init.body && typeof init.body === 'object' && !(init.body instanceof FormData)
      ? JSON.stringify(init.body)
      : (init.body ?? undefined);

  if (body && !headers.has('Content-Type') && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, {
    ...init,
    headers,
    body,
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('An unexpected response was received from the server.');
  }

  return (await response.json()) as T;
}
