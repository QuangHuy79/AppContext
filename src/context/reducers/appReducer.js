// // // // // Để giải quyết triệt để vấn đề Hydration Blocking và Versioning, chúng ta
// // // // // cần thêm một hàm tiện ích để trộn (merge) state cũ và state mới một cách an toàn.
// // // // // Đây là file appReducer.js đã được refactor:
// // // // // src/context/reducers/appReducer.js

// // // // // ⭐️ HÀM TIỆN ÍCH MỚI: Deep Merge Utility
// // // // // Dùng để trộn state đã khôi phục (payload) vào initialState hiện tại (state).
// // // // // Mục đích: Đảm bảo các cấu trúc state mới trong initialState không bị mất
// // // // // nếu dữ liệu lưu trữ cũ (payload) thiếu các trường đó (Version 1 thiếu trường của Version 2).
// // // // const deepMerge = (target, source) => {
// // // //   // Tạo bản sao của target
// // // //   const output = { ...target };

// // // //   if (source) {
// // // //     // Lặp qua tất cả các khóa (key) trong nguồn dữ liệu (source)
// // // //     Object.keys(source).forEach((key) => {
// // // //       const sourceValue = source[key];
// // // //       const targetValue = output[key];

// // // //       // Nếu giá trị là object (và không phải array hoặc null), thực hiện đệ quy
// // // //       if (
// // // //         sourceValue &&
// // // //         typeof sourceValue === "object" &&
// // // //         !Array.isArray(sourceValue) &&
// // // //         targetValue &&
// // // //         typeof targetValue === "object"
// // // //       ) {
// // // //         // 💡 Ví dụ: Merge state.auth vào state.auth
// // // //         output[key] = deepMerge(targetValue, sourceValue);
// // // //       } else {
// // // //         // Nếu không phải object hoặc là array/null, ghi đè trực tiếp
// // // //         output[key] = sourceValue;
// // // //       }
// // // //     });
// // // //   }
// // // //   return output;
// // // // };

// // // // export const appReducer = (state, action) => {
// // // //   const { type, payload } = action;

// // // //   switch (type) {
// // // //     // -----------------------
// // // //     // ⭐️ ACTION MỚI: HYDRATION & VERSIONING
// // // //     // ----------------------
// // // //     case "HYDRATE_APP_STATE": {
// // // //       // 💡 Luồng hoạt động: Được gọi từ StatePersistenceProvider khi khôi phục state
// // // //       if (!payload || typeof payload !== "object") {
// // // //         // Bỏ qua nếu payload không hợp lệ hoặc rỗng
// // // //         return state;
// // // //       }

// // // //       // ⚠️ LƯU Ý QUAN TRỌNG:
// // // //       // Hàm deepMerge sẽ trộn state cũ (payload) vào state mặc định hiện tại (state).
// // // //       // Điều này ngăn ngừa các trường state mới bị xóa bởi dữ liệu lưu trữ cũ.
// // // //       return deepMerge(state, payload);
// // // //     }

// // // //     /** -----------------------
// // // //      * 🧩 UI DOMAIN
// // // //      * ----------------------*/
// // // //     case "UI/SET_LOADING":
// // // //       // ... (Giữ nguyên logic cũ)
// // // //       return {
// // // //         ...state,
// // // //         ui: { ...state.ui, loading: !!payload },
// // // //       };

// // // //     // ... (Các case UI khác giữ nguyên)

// // // //     /** -----------------------
// // // //      * 🔐 AUTH DOMAIN
// // // //      * ----------------------*/
// // // //     case "AUTH/SET_USER":
// // // //       // ... (Giữ nguyên logic cũ)
// // // //       return {
// // // //         ...state,
// // // //         auth: { ...state.auth, user: payload || null },
// // // //       };

// // // //     // ... (Các case AUTH khác giữ nguyên)

// // // //     /** -----------------------
// // // //      * ⚙️ SETTINGS DOMAIN
// // // //      * ----------------------*/
// // // //     case "SETTINGS/SET_THEME":
// // // //       // ... (Giữ nguyên logic cũ)
// // // //       return {
// // // //         ...state,
// // // //         settings: { ...state.settings, theme: payload || "light" },
// // // //       };

// // // //     // ... (Các case SETTINGS, NETWORK, DEVICE, DATA giữ nguyên)

// // // //     /** -----------------------
// // // //      * 🚀 DEFAULT
// // // //      * ----------------------*/
// // // //     default:
// // // //       // 💡 Khuyến nghị: Đây là Nút Thắt Cổ Chai. Trong tương lai,
// // // //       // nên tách Reducer này thành nhiều Reducer con theo domain để tối ưu hiệu năng.
// // // //       return state;
// // // //   }
// // // // };

// // // // ======================================
// // // // FILE FULL — src/context/reducers/appReducer.js (PHASE 4.3 FIXED)
// // // // src/context/reducers/appReducer.js

// // // /**
// // //  * --------------------------------------------------
// // //  * Deep merge helper
// // //  * --------------------------------------------------
// // //  * - Chỉ merge object thuần
// // //  * - Không merge array
// // //  * - Dùng cho hydration an toàn (sau khi whitelist key)
// // //  */
// // // const deepMerge = (target, source) => {
// // //   const output = { ...target };

// // //   if (!source || typeof source !== "object") return output;

// // //   Object.keys(source).forEach((key) => {
// // //     const sourceValue = source[key];
// // //     const targetValue = output[key];

// // //     if (
// // //       sourceValue &&
// // //       typeof sourceValue === "object" &&
// // //       !Array.isArray(sourceValue) &&
// // //       targetValue &&
// // //       typeof targetValue === "object"
// // //     ) {
// // //       output[key] = deepMerge(targetValue, sourceValue);
// // //     } else {
// // //       output[key] = sourceValue;
// // //     }
// // //   });

// // //   return output;
// // // };

// // // /**
// // //  * --------------------------------------------------
// // //  * SAFE HYDRATION CONFIG
// // //  * --------------------------------------------------
// // //  * ❗ AUTH IS INTENTIONALLY EXCLUDED
// // //  */
// // // const SAFE_HYDRATE_KEYS = [
// // //   "ui",
// // //   "settings",
// // //   "network",
// // //   "features",
// // //   "data",
// // //   "dataLoading",
// // // ];

// // // /**
// // //  * --------------------------------------------------
// // //  * App Reducer (GLOBAL)
// // //  * --------------------------------------------------
// // //  * ⚠️ Reducer này TUYỆT ĐỐI KHÔNG xử lý auth / token / user
// // //  * Auth chỉ tồn tại trong AuthContext (memory-only)
// // //  */
// // // export const appReducer = (state, action) => {
// // //   const { type, payload } = action;

// // //   switch (type) {
// // //     /* --------------------------------------------------
// // //        HYDRATION & VERSIONING
// // //     -------------------------------------------------- */
// // //     case "HYDRATE_APP_STATE": {
// // //       if (!payload || typeof payload !== "object") {
// // //         return state;
// // //       }

// // //       // 🔒 Whitelist hydrate keys
// // //       const safePayload = {};
// // //       SAFE_HYDRATE_KEYS.forEach((key) => {
// // //         if (payload[key] !== undefined) {
// // //           safePayload[key] = payload[key];
// // //         }
// // //       });

// // //       return deepMerge(state, safePayload);
// // //     }

// // //     /* --------------------------------------------------
// // //        UI DOMAIN
// // //     -------------------------------------------------- */
// // //     case "UI/SET_LOADING":
// // //       return {
// // //         ...state,
// // //         ui: { ...state.ui, loading: !!payload },
// // //       };

// // //     case "UI/SHOW_TOAST":
// // //       return {
// // //         ...state,
// // //         ui: { ...state.ui, toast: payload },
// // //       };

// // //     case "UI/CLEAR_TOAST":
// // //       return {
// // //         ...state,
// // //         ui: { ...state.ui, toast: null },
// // //       };

// // //     case "UI/SET_SIDEBAR":
// // //       return {
// // //         ...state,
// // //         ui: { ...state.ui, sidebarOpen: !!payload },
// // //       };

// // //     case "UI/TOGGLE_SIDEBAR":
// // //       return {
// // //         ...state,
// // //         ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
// // //       };

// // //     /* --------------------------------------------------
// // //        SETTINGS DOMAIN
// // //     -------------------------------------------------- */
// // //     case "SETTINGS/SET_THEME":
// // //       return {
// // //         ...state,
// // //         settings: {
// // //           ...state.settings,
// // //           theme: payload || "light",
// // //         },
// // //       };

// // //     case "SETTINGS/SET_LOCALE":
// // //       return {
// // //         ...state,
// // //         settings: {
// // //           ...state.settings,
// // //           locale: payload || "en",
// // //         },
// // //       };

// // //     /* --------------------------------------------------
// // //        NETWORK / DEVICE DOMAIN
// // //     -------------------------------------------------- */
// // //     case "NETWORK/SET_ONLINE":
// // //       return {
// // //         ...state,
// // //         network: {
// // //           ...state.network,
// // //           isOnline: !!payload,
// // //         },
// // //       };

// // //     /* --------------------------------------------------
// // //        DATA DOMAIN
// // //     -------------------------------------------------- */
// // //     case "DATA/SET_DATA":
// // //       return {
// // //         ...state,
// // //         data: payload ?? {},
// // //       };

// // //     case "DATA/SET_LOADING":
// // //       return {
// // //         ...state,
// // //         dataLoading: !!payload,
// // //       };

// // //     /* --------------------------------------------------
// // //        DEFAULT
// // //     -------------------------------------------------- */
// // //     default:
// // //       return state;
// // //   }
// // // };

// // // =======================================
// // // appReducer.js — hydrate settings riêng, KHÔNG deep-merge toàn app
// // // src/context/reducers/appReducer.js — PHASE 4.4.2
// // import { initialAppState } from "../initialState";

// // export const appReducer = (state = initialAppState, action) => {
// //   const { type, payload } = action;

// //   switch (type) {
// //     /* -----------------------
// //        🔐 HYDRATION (SAFE)
// //     ------------------------ */
// //     case "HYDRATE_SETTINGS": {
// //       if (!payload || typeof payload !== "object") return state;

// //       return {
// //         ...state,
// //         settings: {
// //           ...state.settings,
// //           ...payload,
// //         },
// //       };
// //     }

// //     /* -----------------------
// //        ⚙️ SETTINGS
// //     ------------------------ */
// //     case "SETTINGS/SET_THEME":
// //       return {
// //         ...state,
// //         settings: {
// //           ...state.settings,
// //           theme: payload || "light",
// //         },
// //       };

// //     case "SETTINGS/SET_LOCALE":
// //       return {
// //         ...state,
// //         settings: {
// //           ...state.settings,
// //           locale: payload || "en",
// //         },
// //       };

// //     /* -----------------------
// //        UI / AUTH / OTHER
// //        (unchanged)
// //     ------------------------ */
// //     default:
// //       return state;
// //   }
// // };

// // ==========================================
// // appReducer.js — FULL FILE (SAU KHI FIX, KHÓA LUỒNG)
// // src/context/reducers/appReducer.js

// import { initialAppState } from "../initialState";

// /* --------------------------------------------------
//    App Reducer
// -------------------------------------------------- */
// export const appReducer = (state = initialAppState, action) => {
//   const { type, payload } = action;

//   switch (type) {
//     /* ==============================================
//        🔁 HYDRATION (PERSISTENCE SAFETY)
//        ============================================== */
//     case "HYDRATE_APP_STATE": {
//       // ❌ Không tin payload
//       if (!payload || typeof payload !== "object") {
//         return state;
//       }

//       // ✅ WHITELIST DOMAIN: settings ONLY
//       const { settings } = payload;

//       if (!settings || typeof settings !== "object") {
//         return state;
//       }

//       return {
//         ...state,
//         settings: {
//           ...state.settings,
//           ...settings,
//         },
//       };
//     }

//     /* ==============================================
//        🧩 UI DOMAIN
//        ============================================== */
//     case "UI/SET_LOADING":
//       return {
//         ...state,
//         ui: {
//           ...state.ui,
//           loading: !!payload,
//         },
//       };

//     /* ==============================================
//        🔐 AUTH DOMAIN
//        ============================================== */
//     case "AUTH/SET_USER":
//       return {
//         ...state,
//         auth: {
//           ...state.auth,
//           user: payload || null,
//         },
//       };

//     /* ==============================================
//        ⚙️ SETTINGS DOMAIN
//        ============================================== */
//     case "SETTINGS/SET_THEME":
//       return {
//         ...state,
//         settings: {
//           ...state.settings,
//           theme: payload || "light",
//         },
//       };

//     /* ==============================================
//        🚀 DEFAULT
//        ============================================== */
//     default:
//       return state;
//   }
// };

// ====================================================
// src/context/reducers/appReducer.js — FIXED (4.3 COMPLIANT)
// src/context/reducers/appReducer.js

import { initialAppState } from "../initialState";

/* --------------------------------------------------
   App Reducer
   - STRICT DOMAIN CONTROL
   - NO AUTH DOMAIN ALLOWED
-------------------------------------------------- */
export const appReducer = (state = initialAppState, action) => {
  const { type, payload } = action;

  switch (type) {
    /* ==============================================
       🔁 HYDRATION (PERSISTENCE SAFETY)
       ============================================== */
    case "HYDRATE_APP_STATE": {
      // ❌ Never trust payload
      if (!payload || typeof payload !== "object") {
        return state;
      }

      // ✅ WHITELIST: settings ONLY
      const { settings } = payload;

      if (!settings || typeof settings !== "object") {
        return state;
      }

      return {
        ...state,
        settings: {
          ...state.settings,
          ...settings,
        },
      };
    }

    /* ==============================================
       🧩 UI DOMAIN
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
       ⚙️ SETTINGS DOMAIN
       ============================================== */
    case "SETTINGS/SET_THEME":
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: payload || "light",
        },
      };

    /* ==============================================
       ⛔ AUTH DOMAIN — EXPLICITLY DENIED
       ============================================== */
    case "AUTH/SET_USER":
    case "AUTH/CLEAR":
      // ❌ AppState must NEVER own auth
      // AuthContext handles this in memory-only
      return state;

    /* ==============================================
       🚀 DEFAULT
       ============================================== */
    default:
      return state;
  }
};
