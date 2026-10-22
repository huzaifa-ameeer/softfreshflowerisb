export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: Record<string, string> };

export async function adminFetch<T>(
  input: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(input, {
      credentials: "same-origin",
      ...init,
    });

    const payload = (await response.json().catch(() => null)) as
      | (T & { error?: string; details?: Record<string, string> })
      | null;

    if (!response.ok) {
      return {
        ok: false,
        error: payload?.error ?? `Request failed (${response.status})`,
        details: payload?.details,
      };
    }

    return { ok: true, data: (payload ?? {}) as T };
  } catch {
    return { ok: false, error: "Network error — is the server running?" };
  }
}

export function errorMessage(result: {
  error: string;
  details?: Record<string, string>;
}) {
  if (!result.details) return result.error;

  const first = Object.values(result.details)[0];

  return first ? `${result.error}: ${first}` : result.error;
}
