// src/context/initialState.js

export const initialAppState = {
  // Domain: auth
  auth: {
    user: null, // { id, name, roles, ... } hoặc null
    token: null, // JWT hoặc null
  },

  // Domain: ui
  ui: {
    loading: false, // global spinner
    toast: null, // { id, message, type } or null
    sidebarOpen: false,
    modal: null, // { id, props } or null
  },

  // Domain: settings
  settings: {
    theme: "light", // "light" | "dark" | "system"
    locale: "en",
    currency: "USD",
  },

  // Domain: network/device - useful for feature toggles
  network: {
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  },

  // Domain: features (placeholder for extension)
  features: {
    // cart: { ... } could be added later by Cart module
  },
  data: {},
  dataLoading: false,
};
