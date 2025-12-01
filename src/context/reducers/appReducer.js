// src/context/reducers/appReducer.js

export const appReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    /** -----------------------
     * 🧩 UI DOMAIN
     * ----------------------*/
    case "UI/SET_LOADING":
      return {
        ...state,
        ui: { ...state.ui, loading: !!payload },
      };

    case "UI/SHOW_TOAST":
      return {
        ...state,
        ui: { ...state.ui, toast: { ...payload } },
      };

    case "UI/CLEAR_TOAST":
      return {
        ...state,
        ui: { ...state.ui, toast: null },
      };

    case "UI/TOGGLE_SIDEBAR":
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
      };

    case "UI/SET_SIDEBAR":
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !!payload },
      };

    case "UI/OPEN_MODAL":
      return {
        ...state,
        ui: { ...state.ui, modal: payload || null },
      };

    case "UI/CLOSE_MODAL":
      return {
        ...state,
        ui: { ...state.ui, modal: null },
      };

    /** -----------------------
     * 🔐 AUTH DOMAIN
     * ----------------------*/
    case "AUTH/SET_USER":
      return {
        ...state,
        auth: { ...state.auth, user: payload || null },
      };

    case "AUTH/SET_TOKEN":
      return {
        ...state,
        auth: { ...state.auth, token: payload || null },
      };

    case "AUTH/RESET":
      return {
        ...state,
        auth: { user: null, token: null },
      };

    /** -----------------------
     * ⚙️ SETTINGS DOMAIN
     * ----------------------*/
    case "SETTINGS/SET_THEME":
      return {
        ...state,
        settings: { ...state.settings, theme: payload || "light" },
      };

    case "SETTINGS/SET_LOCALE":
      return {
        ...state,
        settings: { ...state.settings, locale: payload || "en" },
      };

    // Khi SettingsContext init (từ localStorage)
    case "SETTINGS/INIT":
      return {
        ...state,
        settings: { ...state.settings, ...payload },
      };

    /** -----------------------
     * 🌐 NETWORK DOMAIN
     * ----------------------*/
    case "NETWORK/SET_ONLINE":
      return {
        ...state,
        network: { ...state.network, isOnline: !!payload },
      };

    /** -----------------------
     * 📱 DEVICE DOMAIN
     * ----------------------*/
    case "DEVICE/SET_INFO":
      return {
        ...state,
        device: { ...(state.device || {}), ...payload },
      };
    // --- DATA ---
    case "DATA/SET_ALL":
      return {
        ...state,
        data: action.payload,
      };

    case "DATA/UPDATE":
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.key]: action.payload.value,
        },
      };

    case "DATA/RESET":
      return {
        ...state,
        data: {},
      };

    case "DATA/LOADING":
      return {
        ...state,
        dataLoading: action.payload,
      };
    /** -----------------------
     * 🚀 DEFAULT
     * ----------------------*/
    default:
      return state;
  }
};
