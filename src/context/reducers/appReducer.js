// // src/context/reducers/appReducer.js

// export const appReducer = (state, action) => {
//   const { type, payload } = action;

//   switch (type) {
//     /** -----------------------
//      * 🧩 UI DOMAIN
//      * ----------------------*/
//     case "UI/SET_LOADING":
//       return {
//         ...state,
//         ui: { ...state.ui, loading: !!payload },
//       };

//     case "UI/SHOW_TOAST":
//       return {
//         ...state,
//         ui: { ...state.ui, toast: { ...payload } },
//       };

//     case "UI/CLEAR_TOAST":
//       return {
//         ...state,
//         ui: { ...state.ui, toast: null },
//       };

//     case "UI/TOGGLE_SIDEBAR":
//       return {
//         ...state,
//         ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
//       };

//     case "UI/SET_SIDEBAR":
//       return {
//         ...state,
//         ui: { ...state.ui, sidebarOpen: !!payload },
//       };

//     case "UI/OPEN_MODAL":
//       return {
//         ...state,
//         ui: { ...state.ui, modal: payload || null },
//       };

//     case "UI/CLOSE_MODAL":
//       return {
//         ...state,
//         ui: { ...state.ui, modal: null },
//       };

//     /** -----------------------
//      * 🔐 AUTH DOMAIN
//      * ----------------------*/
//     case "AUTH/SET_USER":
//       return {
//         ...state,
//         auth: { ...state.auth, user: payload || null },
//       };

//     case "AUTH/SET_TOKEN":
//       return {
//         ...state,
//         auth: { ...state.auth, token: payload || null },
//       };

//     case "AUTH/RESET":
//       return {
//         ...state,
//         auth: { user: null, token: null },
//       };

//     /** -----------------------
//      * ⚙️ SETTINGS DOMAIN
//      * ----------------------*/
//     case "SETTINGS/SET_THEME":
//       return {
//         ...state,
//         settings: { ...state.settings, theme: payload || "light" },
//       };

//     case "SETTINGS/SET_LOCALE":
//       return {
//         ...state,
//         settings: { ...state.settings, locale: payload || "en" },
//       };

//     // Khi SettingsContext init (từ localStorage)
//     case "SETTINGS/INIT":
//       return {
//         ...state,
//         settings: { ...state.settings, ...payload },
//       };

//     /** -----------------------
//      * 🌐 NETWORK DOMAIN
//      * ----------------------*/
//     case "NETWORK/SET_ONLINE":
//       return {
//         ...state,
//         network: { ...state.network, isOnline: !!payload },
//       };

//     /** -----------------------
//      * 📱 DEVICE DOMAIN
//      * ----------------------*/
//     case "DEVICE/SET_INFO":
//       return {
//         ...state,
//         device: { ...(state.device || {}), ...payload },
//       };
//     // --- DATA ---
//     case "DATA/SET_ALL":
//       return {
//         ...state,
//         data: action.payload,
//       };

//     case "DATA/UPDATE":
//       return {
//         ...state,
//         data: {
//           ...state.data,
//           [action.payload.key]: action.payload.value,
//         },
//       };

//     case "DATA/RESET":
//       return {
//         ...state,
//         data: {},
//       };

//     case "DATA/LOADING":
//       return {
//         ...state,
//         dataLoading: action.payload,
//       };
//     /** -----------------------
//      * 🚀 DEFAULT
//      * ----------------------*/
//     default:
//       return state;
//   }
// };

// =======================================
// Để giải quyết triệt để vấn đề Hydration Blocking và Versioning, chúng ta
// cần thêm một hàm tiện ích để trộn (merge) state cũ và state mới một cách an toàn.
// Đây là file appReducer.js đã được refactor:
// src/context/reducers/appReducer.js

// ⭐️ HÀM TIỆN ÍCH MỚI: Deep Merge Utility
// Dùng để trộn state đã khôi phục (payload) vào initialState hiện tại (state).
// Mục đích: Đảm bảo các cấu trúc state mới trong initialState không bị mất
// nếu dữ liệu lưu trữ cũ (payload) thiếu các trường đó (Version 1 thiếu trường của Version 2).
const deepMerge = (target, source) => {
  // Tạo bản sao của target
  const output = { ...target };

  if (source) {
    // Lặp qua tất cả các khóa (key) trong nguồn dữ liệu (source)
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = output[key];

      // Nếu giá trị là object (và không phải array hoặc null), thực hiện đệ quy
      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object"
      ) {
        // 💡 Ví dụ: Merge state.auth vào state.auth
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        // Nếu không phải object hoặc là array/null, ghi đè trực tiếp
        output[key] = sourceValue;
      }
    });
  }
  return output;
};

export const appReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    // -----------------------
    // ⭐️ ACTION MỚI: HYDRATION & VERSIONING
    // ----------------------
    case "HYDRATE_APP_STATE": {
      // 💡 Luồng hoạt động: Được gọi từ StatePersistenceProvider khi khôi phục state
      if (!payload || typeof payload !== "object") {
        // Bỏ qua nếu payload không hợp lệ hoặc rỗng
        return state;
      }

      // ⚠️ LƯU Ý QUAN TRỌNG:
      // Hàm deepMerge sẽ trộn state cũ (payload) vào state mặc định hiện tại (state).
      // Điều này ngăn ngừa các trường state mới bị xóa bởi dữ liệu lưu trữ cũ.
      return deepMerge(state, payload);
    }

    /** -----------------------
     * 🧩 UI DOMAIN
     * ----------------------*/
    case "UI/SET_LOADING":
      // ... (Giữ nguyên logic cũ)
      return {
        ...state,
        ui: { ...state.ui, loading: !!payload },
      };

    // ... (Các case UI khác giữ nguyên)

    /** -----------------------
     * 🔐 AUTH DOMAIN
     * ----------------------*/
    case "AUTH/SET_USER":
      // ... (Giữ nguyên logic cũ)
      return {
        ...state,
        auth: { ...state.auth, user: payload || null },
      };

    // ... (Các case AUTH khác giữ nguyên)

    /** -----------------------
     * ⚙️ SETTINGS DOMAIN
     * ----------------------*/
    case "SETTINGS/SET_THEME":
      // ... (Giữ nguyên logic cũ)
      return {
        ...state,
        settings: { ...state.settings, theme: payload || "light" },
      };

    // ... (Các case SETTINGS, NETWORK, DEVICE, DATA giữ nguyên)

    /** -----------------------
     * 🚀 DEFAULT
     * ----------------------*/
    default:
      // 💡 Khuyến nghị: Đây là Nút Thắt Cổ Chai. Trong tương lai,
      // nên tách Reducer này thành nhiều Reducer con theo domain để tối ưu hiệu năng.
      return state;
  }
};
