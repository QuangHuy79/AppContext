export const RuntimeSnapshotContract = {
  network: {
    isOnline: "boolean",
  },

  device: {
    width: "number",
    height: "number",
    orientation: "string",
  },

  settings: {
    theme: "string",
    locale: "string",
  },

  ui: {
    loading: "boolean",
  },

  auth: {
    isAuthenticated: "boolean",
  },

  data: {
    count: "number",
  },

  sync: {
    running: "boolean",
  },
};
