// // src/services/tokenService.js
// const ACCESS_TOKEN_KEY = "accessToken";
// const REFRESH_TOKEN_KEY = "refreshToken";

// export const tokenService = {
//   getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
//   getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

//   setTokens: (accessToken, refreshToken) => {
//     if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
//     if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
//   },

//   clearTokens: () => {
//     localStorage.removeItem(ACCESS_TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//   },
// };

// ====================================
// tokenService.js — PHIÊN BẢN CHUẨN (REFERENCE)
// src/services/tokenService.js

let accessToken = null;
let refreshToken = null;
let isRefreshing = false;
let refreshPromise = null;

export const tokenService = {
  /** 🔒 CHỈ DÙNG NỘI BỘ */
  _setTokens({ access, refresh }) {
    accessToken = access || null;
    refreshToken = refresh || null;
  },

  /** 🔒 KHÔNG EXPOSE TOKEN */
  async getValidAccessToken(refreshFn, onLogout) {
    if (accessToken) return accessToken;

    if (!refreshToken) {
      onLogout();
      throw new Error("NO_REFRESH_TOKEN");
    }

    return this._refreshTokenSingleFlight(refreshFn, onLogout);
  },

  async _refreshTokenSingleFlight(refreshFn, onLogout) {
    if (isRefreshing) return refreshPromise;

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const tokens = await refreshFn(refreshToken);
        this._setTokens(tokens);
        return tokens.access;
      } catch (err) {
        this.clearAll();
        onLogout();
        throw err;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  clearAll() {
    accessToken = null;
    refreshToken = null;
  },

  /** 🔐 ENTRY DUY NHẤT TỪ AUTH */
  bootstrapFromAuth({ access, refresh }) {
    this._setTokens({ access, refresh });
  },
};
