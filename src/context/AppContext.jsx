// // =========================
// // // File AppContext.jsx này là phiên bản nâng cao (core) của toàn hệ thống AppContext modules,
// // // thêm comment chi tiết cấp độ kỹ sư hệ thống để dễ maintain, test, và build các App khác nhau sau này.
// // // Không xóa đoạn này
// // import React, { createContext, useReducer, useMemo, useEffect } from "react";

// // import { appReducer } from "./reducers/appReducer";
// // import { initialAppState } from "./initialState";
// // import toastService from "../services/toastService";
// // import ToastProvider from "../components/Toast/ToastProvider";

// // // 🔹 MODULE PROVIDERS (theo thứ tự phụ thuộc)
// // import { NetworkProvider } from "./modules/NetworkContext";
// // import { DeviceProvider } from "./modules/DeviceContext";
// // import { SettingsProvider } from "./modules/SettingsContext";
// // import { UIProvider } from "./modules/UIContext";
// // import { AuthProvider } from "../context/AuthContext/AuthContext";
// // import { DataProvider } from "./modules/DataContext";
// // import { DataSyncProvider } from "./modules/DataSyncContext";
// // import { APIProvider } from "./APIContext/APIContext";
// // import { CacheProvider } from "./modules/CacheContext";
// // import { StorageProvider } from "./modules/StorageContext";

// // // 🔹 MODULE HOOKS (đồng bộ dữ liệu từ các context con)
// // import { useNetwork } from "../hooks/useNetwork";
// // import { useDevice } from "../hooks/useDevice";
// // import { useSettings } from "../hooks/useSettings";
// // import { useUI } from "../hooks/useUI";

// // // 🧠 AppContext: chứa toàn bộ AppState (root-level)
// // export const AppContext = createContext({
// //   state: initialAppState,
// //   dispatch: () => {},
// // });

// // // 🏗️ AppProvider: provider gốc bao bọc toàn bộ module context
// // export const AppProvider = ({ children }) => {
// //   const [state, dispatch] = useReducer(appReducer, initialAppState);

// //   // 🔧 Gọi hook của các module để lấy dữ liệu runtime
// //   const { isOnline } = useNetwork();
// //   const { deviceInfo } = useDevice();
// //   const { theme, locale } = useSettings();
// //   const { toast } = useUI();

// //   // 🧩 Đồng bộ dữ liệu context con vào AppState (các useEffect này cực kỳ quan trọng)
// //   useEffect(() => {
// //     dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
// //   }, [isOnline]);

// //   useEffect(() => {
// //     dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
// //   }, [deviceInfo]);

// //   useEffect(() => {
// //     dispatch({ type: "SETTINGS/INIT", payload: { theme, locale } });
// //   }, [theme, locale]);

// //   // 🧃 Toast listener: lắng nghe toast từ UIContext và gọi toastService hiển thị
// //   useEffect(() => {
// //     if (toast) {
// //       const { type, message, title } = toast;
// //       toastService.show(type || "info", message, title);
// //       dispatch({ type: "UI/CLEAR_TOAST" }); // xóa toast sau khi hiển thị
// //     }
// //   }, [toast, dispatch]);

// //   // 🌐 Lắng nghe sự kiện online/offline toàn cục
// //   useEffect(() => {
// //     const onOnline = () => {
// //       dispatch({ type: "NETWORK/SET_ONLINE", payload: true });
// //       toastService.show("success", "Bạn đã trực tuyến trở lại", "Online");
// //     };
// //     const onOffline = () => {
// //       dispatch({ type: "NETWORK/SET_ONLINE", payload: false });
// //       toastService.show("error", "Mất kết nối mạng", "Offline");
// //     };
// //     window.addEventListener("online", onOnline);
// //     window.addEventListener("offline", onOffline);
// //     return () => {
// //       window.removeEventListener("online", onOnline);
// //       window.removeEventListener("offline", onOffline);
// //     };
// //   }, []);

// //   // 🧠 Gộp state + dispatch thành 1 object duy nhất
// //   const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

// //   // 🧩 Cấu trúc provider theo dependency thực tế (từ ngoài → trong)
// //   return (
// //     <ToastProvider>
// //       <SettingsProvider>
// //         <NetworkProvider>
// //           <DeviceProvider>
// //             <UIProvider>
// //               <CacheProvider>
// //                 <StorageProvider>
// //                   <APIProvider>
// //                     {/* ✅ AuthProvider phải bọc ngoài DataProvider để login có thể gọi API */}
// //                     <AuthProvider>
// //                       <DataProvider>
// //                         <DataSyncProvider>{children}</DataSyncProvider>
// //                       </DataProvider>
// //                     </AuthProvider>
// //                   </APIProvider>
// //                 </StorageProvider>
// //               </CacheProvider>
// //             </UIProvider>
// //           </DeviceProvider>
// //         </NetworkProvider>
// //       </SettingsProvider>
// //     </ToastProvider>
// //   );
// // };

// // // 🔹 Các hook tiện ích để lấy state, dispatch, hoặc context root
// // export const useAppState = () => React.useContext(AppContext).state;
// // export const useAppDispatch = () => React.useContext(AppContext).dispatch;
// // export const useAppContext = () => React.useContext(AppContext);
// // export const useApp = () => React.useContext(AppContext);

// // Đã check
// // import React, { createContext, useReducer, useMemo, useEffect } from "react";

// // import { appReducer } from "./reducers/appReducer";
// // import { initialAppState } from "./initialState";
// // import toastService from "../services/toastService";
// // import ToastProvider from "../components/Toast/ToastProvider";

// // // 🔹 MODULE PROVIDERS (theo thứ tự phụ thuộc)
// // import { NetworkProvider } from "./modules/NetworkContext";
// // import { DeviceProvider } from "./modules/DeviceContext";
// // import { SettingsProvider } from "./modules/SettingsContext";
// // import { UIProvider } from "./modules/UIContext";
// // import { AuthProvider } from "../context/AuthContext/AuthContext";
// // import { DataProvider } from "./modules/DataContext";
// // import { DataSyncProvider } from "./modules/DataSyncContext";
// // import { APIProvider } from "./APIContext/APIContext";
// // import { CacheProvider } from "./modules/CacheContext";
// // import { StorageProvider } from "./modules/StorageContext";

// // // 🔹 MODULE HOOKS (đồng bộ dữ liệu từ các context con)
// // import { useNetwork } from "../hooks/useNetwork";
// // import { useDevice } from "../hooks/useDevice";
// // import { useSettings } from "../hooks/useSettings";
// // import { useUI } from "../hooks/useUI";

// // // 🧠 AppContext: chứa toàn bộ AppState (root-level)
// // export const AppContext = createContext({
// //   state: initialAppState,
// //   dispatch: () => {},
// // });

// // // 🏗️ AppProvider: provider gốc bao bọc toàn bộ module context
// // export const AppProvider = ({ children }) => {
// //   const [state, dispatch] = useReducer(appReducer, initialAppState);

// //   // 🔧 Gọi hook của các module để lấy dữ liệu runtime
// //   const { isOnline } = useNetwork();
// //   const { deviceInfo } = useDevice();
// //   const { theme, locale } = useSettings();
// //   const { toast } = useUI();

// //   // 🧩 Đồng bộ dữ liệu context con vào AppState
// //   useEffect(() => {
// //     dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
// //   }, [isOnline]);

// //   useEffect(() => {
// //     dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
// //   }, [deviceInfo]);

// //   useEffect(() => {
// //     dispatch({ type: "SETTINGS/INIT", payload: { theme, locale } });
// //   }, [theme, locale]);

// //   // 🧃 Toast listener: lắng nghe toast từ UIContext và gọi toastService hiển thị
// //   useEffect(() => {
// //     if (!toast) return; // ✅ Không có toast thì dừng ngay (tránh log spam)

// //     const { type, message, title } = toast;

// //     // ✅ Hiển thị toast
// //     toastService.show(type || "info", message, title);

// //     // ✅ Dùng timeout nhỏ để tránh CLEAR_TOAST chạy trước khi show hoàn tất
// //     const timer = setTimeout(() => {
// //       dispatch({ type: "UI/CLEAR_TOAST" }); // xoá toast sau khi hiển thị xong
// //     }, 50);

// //     // ✅ Dọn timer khi effect cleanup (tránh memory leak nếu toast thay đổi nhanh)
// //     return () => clearTimeout(timer);
// //   }, [toast, dispatch]);

// //   // 🌐 Lắng nghe sự kiện online/offline toàn cục
// //   useEffect(() => {
// //     const onOnline = () => {
// //       dispatch({ type: "NETWORK/SET_ONLINE", payload: true });
// //       toastService.show("success", "Bạn đã trực tuyến trở lại", "Online");
// //     };
// //     const onOffline = () => {
// //       dispatch({ type: "NETWORK/SET_ONLINE", payload: false });
// //       toastService.show("error", "Mất kết nối mạng", "Offline");
// //     };
// //     window.addEventListener("online", onOnline);
// //     window.addEventListener("offline", onOffline);
// //     return () => {
// //       window.removeEventListener("online", onOnline);
// //       window.removeEventListener("offline", onOffline);
// //     };
// //   }, []);

// //   // 🧠 Gộp state + dispatch thành 1 object duy nhất
// //   const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

// //   // 🧩 Cấu trúc provider theo dependency thực tế (từ ngoài → trong)
// //   return (
// //     <AppContext.Provider value={value}>
// //       <ToastProvider>
// //         <SettingsProvider>
// //           <NetworkProvider>
// //             <DeviceProvider>
// //               <UIProvider>
// //                 <CacheProvider>
// //                   <StorageProvider>
// //                     <APIProvider>
// //                       <AuthProvider>
// //                         <DataProvider>
// //                           <DataSyncProvider>{children}</DataSyncProvider>
// //                         </DataProvider>
// //                       </AuthProvider>
// //                     </APIProvider>
// //                   </StorageProvider>
// //                 </CacheProvider>
// //               </UIProvider>
// //             </DeviceProvider>
// //           </NetworkProvider>
// //         </SettingsProvider>
// //       </ToastProvider>
// //     </AppContext.Provider>
// //   );
// // };

// // // 🔹 Các hook tiện ích để lấy state, dispatch, hoặc context root
// // export const useAppState = () => React.useContext(AppContext).state;
// // export const useAppDispatch = () => React.useContext(AppContext).dispatch;
// // export const useAppContext = () => React.useContext(AppContext);
// // export const useApp = () => React.useContext(AppContext);

// // =================================================
// // src/context/AppContext.jsx
// import React, { createContext, useReducer, useMemo, useEffect } from "react";

// import { appReducer } from "./reducers/appReducer";
// import { initialAppState } from "./initialState";
// import toastService from "../services/toastService";
// import ToastProvider from "../components/Toast/ToastProvider";

// // 🔹 MODULE PROVIDERS
// import { NetworkProvider } from "./modules/NetworkContext";
// import { DeviceProvider } from "./modules/DeviceContext";
// import { SettingsProvider } from "./modules/SettingsContext";
// import { UIProvider } from "./modules/UIContext";
// import { AuthProvider } from "./AuthContext/AuthContext";
// import { DataProvider } from "./modules/DataContext";
// import { DataSyncProvider } from "./modules/DataSyncContext";
// import { APIProvider } from "./APIContext/APIContext";
// import { CacheProvider } from "./modules/CacheContext";
// import { StorageProvider } from "./modules/StorageContext";

// // 🔹 MODULE HOOKS
// import { useNetwork } from "../hooks/useNetwork";
// import { useDevice } from "../hooks/useDevice";
// import { useSettings } from "../hooks/useSettings";
// import { useUI } from "../hooks/useUI";

// /* -----------------------------------------------------------
//    ROOT CONTEXT (state + dispatch)
// ------------------------------------------------------------ */
// export const AppContext = createContext({
//   state: initialAppState,
//   dispatch: () => {},
// });

// /* -----------------------------------------------------------
//    1) Provider Layer – giữ nguyên 100% cấu trúc
// ------------------------------------------------------------ */
// export const AppProvider = ({ children }) => {
//   return (
//     <ToastProvider>
//       <SettingsProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <UIProvider>
//               <CacheProvider>
//                 <StorageProvider>
//                   <APIProvider>
//                     <AuthProvider>
//                       <DataProvider>
//                         <DataSyncProvider>
//                           <AppProviderInner>{children}</AppProviderInner>
//                         </DataSyncProvider>
//                       </DataProvider>
//                     </AuthProvider>
//                   </APIProvider>
//                 </StorageProvider>
//               </CacheProvider>
//             </UIProvider>
//           </DeviceProvider>
//         </NetworkProvider>
//       </SettingsProvider>
//     </ToastProvider>
//   );
// };

// /* -----------------------------------------------------------
//    2) Logic Layer – nơi đọc các module và sync vào AppState
// ------------------------------------------------------------ */
// const AppProviderInner = ({ children }) => {
//   const [state, dispatch] = useReducer(appReducer, initialAppState);

//   // 🎯 Tối ưu: tất cả module hook đều an toàn và stable
//   const { isOnline } = useNetwork();
//   const { deviceInfo } = useDevice();
//   const { theme, locale } = useSettings();
//   const { toast } = useUI();

//   /* -----------------------------------------------------------
//      SYNC MODULE → APP STATE
//   ------------------------------------------------------------ */
//   useEffect(() => {
//     dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
//   }, [isOnline]);

//   useEffect(() => {
//     if (deviceInfo) dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
//   }, [deviceInfo]);

//   useEffect(() => {
//     dispatch({
//       type: "SETTINGS/INIT",
//       payload: { theme, locale },
//     });
//   }, [theme, locale]);

//   /* -----------------------------------------------------------
//      Toast Listener
//   ------------------------------------------------------------ */
//   useEffect(() => {
//     if (!toast) return;

//     toastService.show(toast.type || "info", toast.message, toast.title);

//     const t = setTimeout(() => {
//       dispatch({ type: "UI/CLEAR_TOAST" });
//     }, 50);

//     return () => clearTimeout(t);
//   }, [toast]);

//   /* -----------------------------------------------------------
//      Browser Online/Offline Events
//   ------------------------------------------------------------ */
//   useEffect(() => {
//     const goOnline = () => {
//       dispatch({ type: "NETWORK/SET_ONLINE", payload: true });
//       toastService.show("success", "Bạn đã trực tuyến trở lại", "Online");
//     };
//     const goOffline = () => {
//       dispatch({ type: "NETWORK/SET_ONLINE", payload: false });
//       toastService.show("error", "Mất kết nối mạng", "Offline");
//     };

//     window.addEventListener("online", goOnline);
//     window.addEventListener("offline", goOffline);

//     return () => {
//       window.removeEventListener("online", goOnline);
//       window.removeEventListener("offline", goOffline);
//     };
//   }, []);

//   /* -----------------------------------------------------------
//      VALUE TỐI ƯU – CHỈ RE-RENDER KHI state thay đổi thực sự
//   ------------------------------------------------------------ */
//   const value = useMemo(() => ({ state, dispatch }), [state]);

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// /* -----------------------------------------------------------
//    HOOKS SELECTOR TỐI ƯU (Step 9 yêu cầu)
// ------------------------------------------------------------ */
// export const useApp = () => React.useContext(AppContext);
// export const useAppState = () => React.useContext(AppContext).state;
// export const useAppDispatch = () => React.useContext(AppContext).dispatch;
// export const useAppContext = () => React.useContext(AppContext);
// /* 🎯 Selector tránh full re-render ở UICluster / Orchestrator */
// export const useAppSelector = (selector) => {
//   const { state } = React.useContext(AppContext);
//   return selector(state);
// };

// // ===============================================================
// // FILE 1 — src/context/AppContext.jsx (FIXED)
// // src/context/AppContext.jsx
// import React, {
//   createContext,
//   useReducer,
//   useEffect,
//   useRef,
//   useContext,
// } from "react";

// import { appReducer } from "./reducers/appReducer";
// import { initialAppState } from "./initialState";
// import toastService from "../services/toastService";
// import ToastProvider from "../components/Toast/ToastProvider";

// // MODULE PROVIDERS
// import { NetworkProvider } from "./modules/NetworkContext";
// import { DeviceProvider } from "./modules/DeviceContext";
// import { SettingsProvider } from "./modules/SettingsContext";
// import { UIProvider } from "./modules/UIContext";
// import { AuthProvider } from "./AuthContext/AuthContext";
// import { DataProvider } from "./modules/DataContext";
// import { DataSyncProvider } from "./modules/DataSyncContext";
// import { APIProvider } from "./APIContext/APIContext";
// import { CacheProvider } from "./modules/CacheContext";
// import { StorageProvider } from "./modules/StorageContext";

// // MODULE HOOKS
// import { useNetwork } from "../hooks/useNetwork";
// import { useDevice } from "../hooks/useDevice";
// import { useSettings } from "../hooks/useSettings";
// import { useUI } from "../hooks/useUI";

// /* ============================================================
//    APP CONTEXT — GIỮ NGUYÊN CONTRACT
// ============================================================ */

// export const AppContext = createContext({
//   state: initialAppState,
//   dispatch: () => {},
// });

// /* ============================================================
//    PROVIDER COMPOSITION (KHÔNG ĐỔI)
// ============================================================ */

// export const AppProvider = ({ children }) => {
//   return (
//     <ToastProvider>
//       <SettingsProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <UIProvider>
//               <CacheProvider>
//                 <StorageProvider>
//                   <APIProvider>
//                     <AuthProvider>
//                       <DataProvider>
//                         <DataSyncProvider>
//                           <AppProviderInner>{children}</AppProviderInner>
//                         </DataSyncProvider>
//                       </DataProvider>
//                     </AuthProvider>
//                   </APIProvider>
//                 </StorageProvider>
//               </CacheProvider>
//             </UIProvider>
//           </DeviceProvider>
//         </NetworkProvider>
//       </SettingsProvider>
//     </ToastProvider>
//   );
// };

// /* ============================================================
//    CORE LOGIC
// ============================================================ */

// const AppProviderInner = ({ children }) => {
//   const [state, dispatch] = useReducer(appReducer, initialAppState);

//   // 🔒 STABLE CONTEXT VALUE (KEY FIX STEP 3.1)
//   const ctxRef = useRef({ state, dispatch });

//   ctxRef.current.state = state;
//   ctxRef.current.dispatch = dispatch;

//   // module hooks
//   const { isOnline } = useNetwork();
//   const { deviceInfo } = useDevice();
//   const { theme, locale } = useSettings();
//   const { toast } = useUI();

//   /* ---------------- SYNC MODULE → STATE ---------------- */

//   useEffect(() => {
//     dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
//   }, [isOnline]);

//   useEffect(() => {
//     if (deviceInfo) {
//       dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
//     }
//   }, [deviceInfo]);

//   useEffect(() => {
//     dispatch({
//       type: "SETTINGS/INIT",
//       payload: { theme, locale },
//     });
//   }, [theme, locale]);

//   /* ---------------- TOAST ---------------- */

//   useEffect(() => {
//     if (!toast) return;

//     toastService.show(toast.type || "info", toast.message, toast.title);

//     const t = setTimeout(() => {
//       dispatch({ type: "UI/CLEAR_TOAST" });
//     }, 50);

//     return () => clearTimeout(t);
//   }, [toast]);

//   /* ---------------- ONLINE / OFFLINE ---------------- */

//   useEffect(() => {
//     const goOnline = () =>
//       dispatch({ type: "NETWORK/SET_ONLINE", payload: true });
//     const goOffline = () =>
//       dispatch({ type: "NETWORK/SET_ONLINE", payload: false });

//     window.addEventListener("online", goOnline);
//     window.addEventListener("offline", goOffline);

//     return () => {
//       window.removeEventListener("online", goOnline);
//       window.removeEventListener("offline", goOffline);
//     };
//   }, []);

//   return (
//     <AppContext.Provider value={ctxRef.current}>{children}</AppContext.Provider>
//   );
// };

// /* ============================================================
//    HOOKS — GIỮ NGUYÊN EXPORT
// ============================================================ */

// export const useApp = () => {
//   const ctx = useContext(AppContext);
//   if (!ctx) {
//     throw new Error("useApp must be used within an AppProvider");
//   }
//   return ctx;
// };

// export const useAppState = () => useApp().state;
// export const useAppDispatch = () => useApp().dispatch;

// =============================================
// FILE FULL AppContext.jsx
// 👉 CHỈ xóa đúng 2 chỗ theo Phase 3.7, không đụng gì khác.
// ❌ ĐÃ XÓA:
// useEffect TOAST
// useEffect ONLINE / OFFLINE
// ✅ GIỮ NGUYÊN: provider composition, ctxRef, sync state, hooks
// src/context/AppContext.jsx
import React, {
  createContext,
  useReducer,
  useRef,
  useContext,
  useEffect,
} from "react";

import { appReducer } from "./reducers/appReducer";
import { initialAppState } from "./initialState";
import ToastProvider from "../components/Toast/ToastProvider";

// MODULE PROVIDERS
import { NetworkProvider } from "./modules/NetworkContext";
import { DeviceProvider } from "./modules/DeviceContext";
import { SettingsProvider } from "./modules/SettingsContext";
import { UIProvider } from "./modules/UIContext";
import { AuthProvider } from "./AuthContext/AuthContext";
import { DataProvider } from "./modules/DataContext";
import { DataSyncProvider } from "./modules/DataSyncContext";
import { APIProvider } from "./APIContext/APIContext";
import { CacheProvider } from "./modules/CacheContext";
import { StorageProvider } from "./modules/StorageContext";

// MODULE HOOKS
import { useNetwork } from "../hooks/useNetwork";
import { useDevice } from "../hooks/useDevice";
import { useSettings } from "../hooks/useSettings";

/* ============================================================
   APP CONTEXT — CONTRACT GIỮ NGUYÊN
============================================================ */

export const AppContext = createContext({
  state: initialAppState,
  dispatch: () => {},
});

/* ============================================================
   PROVIDER COMPOSITION
============================================================ */

export const AppProvider = ({ children }) => {
  return (
    <ToastProvider>
      <SettingsProvider>
        <NetworkProvider>
          <DeviceProvider>
            <UIProvider>
              <CacheProvider>
                <StorageProvider>
                  <APIProvider>
                    <AuthProvider>
                      <DataProvider>
                        <DataSyncProvider>
                          <AppProviderInner>{children}</AppProviderInner>
                        </DataSyncProvider>
                      </DataProvider>
                    </AuthProvider>
                  </APIProvider>
                </StorageProvider>
              </CacheProvider>
            </UIProvider>
          </DeviceProvider>
        </NetworkProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};

/* ============================================================
   CORE LOGIC (STATE HUB ONLY)
============================================================ */

const AppProviderInner = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // 🔒 STABLE CONTEXT VALUE
  const ctxRef = useRef({ state, dispatch });
  ctxRef.current.state = state;
  ctxRef.current.dispatch = dispatch;

  // module hooks (READ-ONLY SIGNALS)
  const { isOnline } = useNetwork();
  const { deviceInfo } = useDevice();
  const { theme, locale } = useSettings();

  /* -----------------------------
     DERIVED STATE SYNC (TEMP – Phase 3.7 OK)
  ------------------------------ */

  useEffect(() => {
    dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
  }, [isOnline]);

  useEffect(() => {
    if (deviceInfo) {
      dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
    }
  }, [deviceInfo]);

  useEffect(() => {
    dispatch({
      type: "SETTINGS/INIT",
      payload: { theme, locale },
    });
  }, [theme, locale]);

  return (
    <AppContext.Provider value={ctxRef.current}>{children}</AppContext.Provider>
  );
};

/* ============================================================
   HOOKS — EXPORT GIỮ NGUYÊN
============================================================ */

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
};

export const useAppState = () => useApp().state;
export const useAppDispatch = () => useApp().dispatch;
