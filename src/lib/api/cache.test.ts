import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cachedFetch, __clearCache, ApiError } from "./cache";

const identity = (d: unknown) => d;

describe("cachedFetch", () => {
  beforeEach(() => __clearCache());
  afterEach(() => vi.restoreAllMocks());

  it("caches the parsed result and only fetches once", async () => {
    const spy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ value: 42 }),
    });
    vi.stubGlobal("fetch", spy);
    const a = await cachedFetch("https://x/1", identity);
    const b = await cachedFetch("https://x/1", identity);
    expect(a).toEqual({ value: 42 });
    expect(b).toEqual({ value: 42 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("de-duplicates concurrent in-flight requests", async () => {
    let calls = 0;
    const spy = vi.fn().mockImplementation(() => {
      calls++;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ n: calls }),
      });
    });
    vi.stubGlobal("fetch", spy);
    const [a, b] = await Promise.all([
      cachedFetch("https://x/2", identity),
      cachedFetch("https://x/2", identity),
    ]);
    expect(a).toBe(b);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("throws ApiError with status on non-ok responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 })
    );
    await expect(cachedFetch("https://x/404", identity)).rejects.toBeInstanceOf(
      ApiError
    );
  });

  it("does not cache failed requests", async () => {
    const spy = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ ok: 1 }),
      });
    vi.stubGlobal("fetch", spy);
    await expect(cachedFetch("https://x/retry", identity)).rejects.toThrow();
    const second = await cachedFetch("https://x/retry", identity);
    expect(second).toEqual({ ok: 1 });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
