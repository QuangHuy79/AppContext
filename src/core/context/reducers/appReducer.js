/**
 * 🔒 CORE STABILITY ZONE
 * ---------------------------------
 * DO NOT MODIFY WITHOUT:
 * - updating invariant tests (Phase 6)
 * - migration strategy
 *
 * Locked after Phase 6
 */

// appReducer.js (FINAL – KHÔNG SỬA THÊM)
import { initialAppState } from "../initialState";

export const appReducer = (state = initialAppState, action) => {
  if (!action || typeof action !== "object") return state;

  const { type, payload } = action;

  switch (type) {
    /* ==============================================
       🔁 HYDRATE
       - STRICT when booting (initialAppState)
       - TOLERANT after app is running
       ============================================== */
    case "HYDRATE_APP_STATE": {
      if (!payload || typeof payload !== "object") {
        return state;
      }

      const isBootHydration = state === initialAppState;

      /* ---------- STRICT MODE (PERSISTENCE) ---------- */
      if (isBootHydration) {
        const rootKeys = Object.keys(payload);
        if (rootKeys.length !== 1 || rootKeys[0] !== "settings") {
          return state;
        }

        const { settings } = payload;
        if (!settings || typeof settings !== "object") {
          return state;
        }

        const settingKeys = Object.keys(settings);
        if (settingKeys.length !== 1 || settingKeys[0] !== "theme") {
          return state;
        }

        if (typeof settings.theme !== "string") {
          return state;
        }
      }

      /* ---------- TOLERANT MODE ---------- */
      if (!payload.settings || typeof payload.settings !== "object") {
        return state;
      }

      if (
        "theme" in payload.settings &&
        typeof payload.settings.theme !== "string"
      ) {
        return state;
      }

      return {
        ...state,
        settings: {
          ...state.settings,
          ...payload.settings,
        },
      };
    }

    /* ==============================================
       UI
       ============================================== */
    case "UI/SET_LOADING":
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: !!payload,
        },
      };

    /* ==============================================
       SETTINGS
       ============================================== */
    case "SETTINGS/SET_THEME":
      if (typeof payload !== "string") return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: payload,
        },
      };

    /* ==============================================
       AUTH — NEVER ALLOWED
       ============================================== */
    case "AUTH/SET_USER":
    case "AUTH/CLEAR":
      return state;

    default:
      return state;
  }
};
