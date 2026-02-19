// FILE FIX 1 — initialState.js (PHASE 4.3 FIXED)
// src/context/initialState.js

export const initialAppState = {
  // ❌ AUTH DOMAIN REMOVED
  // Auth state is owned exclusively by AuthContext (memory-only)

  // Domain: ui
  ui: {
    loading: false,
    toast: null,
    sidebarOpen: false,
    modal: null,
  },

  // Domain: settings
  settings: {
    theme: "light",
    locale: "en",
    currency: "USD",
  },

  // Domain: network/device
  network: {
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  },

  // Domain: features
  features: {},

  // Domain: data
  data: {},
  dataLoading: false,
};
