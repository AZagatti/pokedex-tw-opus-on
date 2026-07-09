// In-memory response cache with in-flight request de-duplication.
// PokeAPI data is immutable, so cached entries never expire.
const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

export class ApiError extends Error {
  status: number;
  constructor(status: number, url: string) {
    super(`Request failed (${status}) for ${url}`);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Fetch JSON from `url`, caching the parsed result and de-duplicating
 * concurrent requests for the same URL.
 */
export async function cachedFetch<T>(
  url: string,
  parse: (data: unknown) => T
): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }
  const existing = inflight.get(url);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = (async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new ApiError(res.status, url);
    }
    const json: unknown = await res.json();
    const parsed = parse(json);
    cache.set(url, parsed);
    inflight.delete(url);
    return parsed;
  })().catch((error) => {
    inflight.delete(url);
    throw error;
  });

  inflight.set(url, promise);
  return promise;
}

/** Test helper — clear all cached state. */
export function __clearCache(): void {
  cache.clear();
  inflight.clear();
}
