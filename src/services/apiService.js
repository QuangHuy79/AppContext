// // src/services/apiService.js

// const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.example.com";

// const DEFAULT_TIMEOUT = 10_000; // 10s — transport-level invariant

// /* --------------------------------------------------
//    Error normalizer (TRANSPORT ONLY)
// -------------------------------------------------- */
// function normalizeApiError(error, meta = {}) {
//   if (error.name === "AbortError") {
//     return {
//       type: "API_ABORTED",
//       message: "Request aborted",
//       meta,
//     };
//   }

//   if (error instanceof TypeError) {
//     return {
//       type: "NETWORK_ERROR",
//       message: error.message || "Network error",
//       meta,
//     };
//   }

//   return {
//     type: "API_ERROR",
//     message: error.message || "API error",
//     status: error.status,
//     meta,
//   };
// }

// /* --------------------------------------------------
//    Core request
// -------------------------------------------------- */
// async function request(endpoint, options = {}) {
//   const {
//     method = "GET",
//     headers = {},
//     body,
//     signal,
//     timeout = DEFAULT_TIMEOUT,
//   } = options;

//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: body ? JSON.stringify(body) : undefined,
//       signal: signal ?? controller.signal,
//     });

//     const isJson =
//       response.headers.get("content-type")?.includes("application/json") ??
//       false;

//     const data = isJson ? await response.json() : null;

//     if (!response.ok) {
//       const err = new Error(data?.message || "Request failed");
//       err.status = response.status;
//       throw err;
//     }

//     return data;
//   } catch (error) {
//     throw normalizeApiError(error, {
//       endpoint,
//       method,
//     });
//   } finally {
//     clearTimeout(timeoutId);
//   }
// }

// /* --------------------------------------------------
//    Public API (NO POLICY)
// -------------------------------------------------- */
// export const apiService = {
//   get(endpoint, options = {}) {
//     return request(endpoint, { ...options, method: "GET" });
//   },

//   post(endpoint, body, options = {}) {
//     return request(endpoint, {
//       ...options,
//       method: "POST",
//       body,
//     });
//   },

//   put(endpoint, body, options = {}) {
//     return request(endpoint, {
//       ...options,
//       method: "PUT",
//       body,
//     });
//   },

//   delete(endpoint, options = {}) {
//     return request(endpoint, {
//       ...options,
//       method: "DELETE",
//     });
//   },
// };

// ============================================
// FILE FULL — src/services/apiService.js (PHASE 4.5.2)
// src/services/apiService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const DEFAULT_TIMEOUT = 10_000;

/* --------------------------------------------------
   Error Types (LOCKED)
-------------------------------------------------- */
const ERROR_TYPE = {
  ABORT: "abort",
  TIMEOUT: "timeout",
  NETWORK: "network",
  SERVER: "server",
  INVALID_RESPONSE: "invalid-response",
  UNKNOWN: "unknown",
};

/* --------------------------------------------------
   Response validator (json-server friendly)
-------------------------------------------------- */
function isValidResponse(data) {
  if (data === null) return true;
  if (Array.isArray(data)) return true;
  if (typeof data === "object") return true;
  return false;
}

/* --------------------------------------------------
   Error normalizer (FORMAL)
-------------------------------------------------- */
function normalizeError(error, meta) {
  // Abort by user / controller
  if (error?.name === "AbortError") {
    return {
      type: ERROR_TYPE.ABORT,
      message: "Request aborted",
      meta,
    };
  }

  // Network / CORS / DNS
  if (error instanceof TypeError) {
    return {
      type: ERROR_TYPE.NETWORK,
      message: "Network error",
      meta,
    };
  }

  // Fallback
  return {
    type: ERROR_TYPE.UNKNOWN,
    message: "Unknown error",
    meta,
  };
}

/* --------------------------------------------------
   Core request (NO THROW)
-------------------------------------------------- */
async function request(endpoint, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    signal,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: signal ?? controller.signal,
    });

    let data = null;
    const isJson =
      res.headers.get("content-type")?.includes("application/json") ?? false;

    if (isJson) {
      try {
        data = await res.json();
      } catch {
        return {
          ok: false,
          error: {
            type: ERROR_TYPE.INVALID_RESPONSE,
            message: "Invalid JSON response",
            status: res.status,
            meta: { endpoint, method },
          },
        };
      }
    }

    if (!res.ok) {
      return {
        ok: false,
        error: {
          type: ERROR_TYPE.SERVER,
          message: "Request failed",
          status: res.status,
          meta: { endpoint, method },
        },
      };
    }

    if (!isValidResponse(data)) {
      return {
        ok: false,
        error: {
          type: ERROR_TYPE.INVALID_RESPONSE,
          message: "Unexpected response shape",
          status: res.status,
          meta: { endpoint, method },
        },
      };
    }

    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: normalizeError(error, { endpoint, method }),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/* --------------------------------------------------
   Public API (STABLE)
-------------------------------------------------- */
export const apiService = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};
