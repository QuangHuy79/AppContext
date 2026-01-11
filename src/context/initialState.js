// // src/context/initialState.js

// export const initialAppState = {
//   // Domain: auth
//   auth: {
//     user: null, // { id, name, roles, ... } hoặc null
//     token: null, // JWT hoặc null
//   },

//   // Domain: ui
//   ui: {
//     loading: false, // global spinner
//     toast: null, // { id, message, type } or null
//     sidebarOpen: false,
//     modal: null, // { id, props } or null
//   },

//   // Domain: settings
//   settings: {
//     theme: "light", // "light" | "dark" | "system"
//     locale: "en",
//     currency: "USD",
//   },

//   // Domain: network/device - useful for feature toggles
//   network: {
//     isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
//   },

//   // Domain: features (placeholder for extension)
//   features: {
//     // cart: { ... } could be added later by Cart module
//   },
//   data: {},
//   dataLoading: false,
// };

// =================================
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
