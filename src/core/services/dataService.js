// src/services/dataService.js
import { apiService } from "./apiService";

/* --------------------------------------------------
   Cache config
-------------------------------------------------- */
const CACHE_KEY = "app:data:cache";
const CACHE_TTL = 60_000; // 60s — sống lâu hơn render, ngắn hơn session
const MAX_RETRY = 2;

/* --------------------------------------------------
   Cache helpers
-------------------------------------------------- */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    /* silent — cache failure must not crash app */
  }
}

function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

/* --------------------------------------------------
   Retry helper (QUERY ONLY)
-------------------------------------------------- */
async function retryQuery(fn, { retries = MAX_RETRY } = {}) {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;

      const shouldStop =
        attempt > retries ||
        err?.type === "API_ABORTED" ||
        err?.type === "NETWORK_ERROR" ||
        (err?.status >= 400 && err?.status < 500);

      if (shouldStop) {
        throw err;
      }

      await new Promise((r) => setTimeout(r, 300 * attempt)); // backoff
    }
  }
}

/* --------------------------------------------------
   Data service
-------------------------------------------------- */
export const dataService = {
  /* -----------------------------
     QUERY: fetchAll
     - cache-first
     - retryable
  ------------------------------ */
  async fetchAll({ force = false, signal } = {}) {
    if (!force) {
      const cached = readCache();
      if (cached) {
        return cached;
      }
    }

    const data = await retryQuery(
      () =>
        apiService.get("/data", {
          signal,
        }),
      { retries: MAX_RETRY }
    );

    writeCache(data);
    return data;
  },

  /* -----------------------------
     MUTATION: save
     - no retry
     - invalidate cache
  ------------------------------ */
  async save(key, value, { signal } = {}) {
    await apiService.post(`/data/${key}`, { value }, { signal });

    // cache invalidation — strict
    clearCache();
    return true;
  },

  /* -----------------------------
     MUTATION: clear
     - no retry
     - local + remote safe
  ------------------------------ */
  async clear({ signal } = {}) {
    clearCache();

    try {
      await apiService.delete("/data", { signal });
    } catch {
      // silent — local clear must succeed even if remote fails
    }
  },
};
