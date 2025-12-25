// /**
//  * Runtime Snapshot Contract
//  * STEP 11.1
//  *
//  * Đây là SOURCE OF TRUTH cho snapshot shape
//  */

// export const RuntimeSnapshotContract = {
//   network: {
//     isOnline: "boolean",
//   },

//   device: {
//     width: "number",
//     height: "number",
//     orientation: "string",
//   },

//   settings: {
//     theme: "string",
//     language: "string",
//   },

//   ui: {
//     ready: "boolean",
//   },

//   auth: {
//     isAuthenticated: "boolean",
//   },

//   data: {
//     count: "number",
//   },

//   sync: {
//     running: "boolean",
//   },
// };

// ==================================
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
