// APIContext.jsx theo C-2
// src/context/APIContext/APIContext.jsx
import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { tokenService } from "../../services/tokenService";
import toastService from "../../services/toastService";

const BASE_URL = "http://localhost:3001";

export const APIContext = createContext(null);

/**
 * Production-ready APIProvider
 *
 * - Exposes a stable `api` object (memoized) so consumers won't re-render when internal state changes.
 * - Requests are cancellable via AbortController.
 * - Does NOT expose internal loading state as part of context value (prevents wide re-renders).
 * - Provides helper createAbortController() so callers can cancel long requests.
 */
export const APIProvider = ({ children }) => {
  // useRef for any internal mutable state (not exposed to context value)
  const pendingCountRef = useRef(0);

  // helper: create controller
  const createAbortController = useCallback(() => new AbortController(), []);

  // core request function (cancellable)
  const request = useCallback(
    async (endpoint, options = {}, showToast = true) => {
      // allow caller to pass a signal in options.signal to control cancellation
      const controller = options.signal ? null : new AbortController();
      const signal = options.signal ?? controller.signal;

      const url = endpoint.startsWith("http")
        ? endpoint
        : `${BASE_URL}${endpoint}`;

      const mergedOptions = {
        method: options.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        body: options.body,
        signal,
      };

      // track pending (internal only)
      pendingCountRef.current += 1;

      try {
        const res = await fetch(url, mergedOptions);

        if (!res.ok) {
          // try to parse error body safely
          let errBody = null;
          try {
            errBody = await res.json();
          } catch {
            errBody = null;
          }
          const message =
            (errBody && (errBody.message || JSON.stringify(errBody))) ||
            `HTTP ${res.status}`;
          const err = new Error(message);
          err.status = res.status;
          throw err;
        }

        // safe parse JSON
        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (showToast) {
          toastService.show("success", "Fetch thành công", `API: ${endpoint}`);
        }

        return data;
      } catch (error) {
        // abort is not an actual "error" we want to toast always
        if (error.name === "AbortError") {
          // suppressed abort
          // console.debug("[API] request aborted:", endpoint);
          throw error;
        }

        // logging & toast
        console.error("[APIContext] Request error:", error);
        if (showToast) {
          toastService.show("error", error.message || "API Error", "API Error");
        }
        throw error;
      } finally {
        pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
      }
    },
    []
  );
  // --------------------------------------------------------
  // 🔐 C-3: requestWithAuth — auth-aware + refresh + retry
  // --------------------------------------------------------
  const requestWithAuth = useCallback(
    async (endpoint, options = {}, showToast = true) => {
      let retried = false;

      const exec = async () => {
        const accessToken = tokenService.getAccessToken();

        return request(
          endpoint,
          {
            ...options,
            headers: {
              ...(options.headers || {}),
              ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
            },
          },
          showToast
        );
      };

      try {
        return await exec();
      } catch (err) {
        //  chỉ intercept 401 đúng 1 lần
        // if (
        //   err?.message?.includes("401") &&
        //   !retried &&
        //   tokenService.getRefreshToken()
        // )
        if (err?.status === 401 && !retried && tokenService.getRefreshToken()) {
          retried = true;

          try {
            // refresh token (AuthContext sẽ handle toast)
            await fetch(`${BASE_URL}/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                refreshToken: tokenService.getRefreshToken(),
              }),
            })
              .then((r) => {
                if (!r.ok) throw new Error("Refresh failed");
                return r.json();
              })
              .then((res) => {
                if (res?.accessToken) {
                  tokenService.setTokens(
                    res.accessToken,
                    tokenService.getRefreshToken()
                  );
                }
              });

            // 🔁 retry request đúng 1 lần
            return await exec();
          } catch (refreshErr) {
            tokenService.clearTokens();
            throw refreshErr;
          }
        }

        throw err;
      }
    },
    [request]
  );

  // helper convenience methods — stable refs via useCallback
  const get = useCallback(
    (endpoint, showToast = true, options = {}) => {
      return request(endpoint, { ...options, method: "GET" }, showToast);
    },
    [request]
  );

  const post = useCallback(
    (endpoint, body, showToast = true, options = {}) => {
      const bodyStr = body !== undefined ? JSON.stringify(body) : undefined;
      return request(
        endpoint,
        { ...options, method: "POST", body: bodyStr },
        showToast
      );
    },
    [request]
  );

  const put = useCallback(
    (endpoint, body, showToast = true, options = {}) => {
      const bodyStr = body !== undefined ? JSON.stringify(body) : undefined;
      return request(
        endpoint,
        { ...options, method: "PUT", body: bodyStr },
        showToast
      );
    },
    [request]
  );

  const del = useCallback(
    (endpoint, showToast = true, options = {}) => {
      return request(endpoint, { ...options, method: "DELETE" }, showToast);
    },
    [request]
  );

  // Expose a stable api object (useMemo)
  const api = useMemo(
    () => ({
      request,
      get,
      post,
      put,
      del,
      // 🔹 C-3
      requestWithAuth,
      createAbortController,

      // helpful read-only status (derived from ref) — function so not a reactive value
      isBusy: () => pendingCountRef.current > 0,
    }),
    [request, get, post, put, del, requestWithAuth, createAbortController]
  );

  return <APIContext.Provider value={{ api }}>{children}</APIContext.Provider>;
};

// consumer hook
export const useAPI = () => {
  const ctx = useContext(APIContext);
  if (!ctx) throw new Error("useAPI must be used within APIProvider");
  return ctx;
};
