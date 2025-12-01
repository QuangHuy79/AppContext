// =========================
// // File AppContext.jsx này là phiên bản nâng cao (core) của toàn hệ thống AppContext modules,
// // thêm comment chi tiết cấp độ kỹ sư hệ thống để dễ maintain, test, và build các App khác nhau sau này.
// // Không xóa đoạn này
// import React, { createContext, useReducer, useMemo, useEffect } from "react";

// import { appReducer } from "./reducers/appReducer";
// import { initialAppState } from "./initialState";
// import toastService from "../services/toastService";
// import ToastProvider from "../components/Toast/ToastProvider";

// // 🔹 MODULE PROVIDERS (theo thứ tự phụ thuộc)
// import { NetworkProvider } from "./modules/NetworkContext";
// import { DeviceProvider } from "./modules/DeviceContext";
// import { SettingsProvider } from "./modules/SettingsContext";
// import { UIProvider } from "./modules/UIContext";
// import { AuthProvider } from "../context/AuthContext/AuthContext";
// import { DataProvider } from "./modules/DataContext";
// import { DataSyncProvider } from "./modules/DataSyncContext";
// import { APIProvider } from "./APIContext/APIContext";
// import { CacheProvider } from "./modules/CacheContext";
// import { StorageProvider } from "./modules/StorageContext";

// // 🔹 MODULE HOOKS (đồng bộ dữ liệu từ các context con)
// import { useNetwork } from "../hooks/useNetwork";
// import { useDevice } from "../hooks/useDevice";
// import { useSettings } from "../hooks/useSettings";
// import { useUI } from "../hooks/useUI";

// // 🧠 AppContext: chứa toàn bộ AppState (root-level)
// export const AppContext = createContext({
//   state: initialAppState,
//   dispatch: () => {},
// });

// // 🏗️ AppProvider: provider gốc bao bọc toàn bộ module context
// export const AppProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(appReducer, initialAppState);

//   // 🔧 Gọi hook của các module để lấy dữ liệu runtime
//   const { isOnline } = useNetwork();
//   const { deviceInfo } = useDevice();
//   const { theme, locale } = useSettings();
//   const { toast } = useUI();

//   // 🧩 Đồng bộ dữ liệu context con vào AppState (các useEffect này cực kỳ quan trọng)
//   useEffect(() => {
//     dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
//   }, [isOnline]);

//   useEffect(() => {
//     dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
//   }, [deviceInfo]);

//   useEffect(() => {
//     dispatch({ type: "SETTINGS/INIT", payload: { theme, locale } });
//   }, [theme, locale]);

//   // 🧃 Toast listener: lắng nghe toast từ UIContext và gọi toastService hiển thị
//   useEffect(() => {
//     if (toast) {
//       const { type, message, title } = toast;
//       toastService.show(type || "info", message, title);
//       dispatch({ type: "UI/CLEAR_TOAST" }); // xóa toast sau khi hiển thị
//     }
//   }, [toast, dispatch]);

//   // 🌐 Lắng nghe sự kiện online/offline toàn cục
//   useEffect(() => {
//     const onOnline = () => {
//       dispatch({ type: "NETWORK/SET_ONLINE", payload: true });
//       toastService.show("success", "Bạn đã trực tuyến trở lại", "Online");
//     };
//     const onOffline = () => {
//       dispatch({ type: "NETWORK/SET_ONLINE", payload: false });
//       toastService.show("error", "Mất kết nối mạng", "Offline");
//     };
//     window.addEventListener("online", onOnline);
//     window.addEventListener("offline", onOffline);
//     return () => {
//       window.removeEventListener("online", onOnline);
//       window.removeEventListener("offline", onOffline);
//     };
//   }, []);

//   // 🧠 Gộp state + dispatch thành 1 object duy nhất
//   const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

//   // 🧩 Cấu trúc provider theo dependency thực tế (từ ngoài → trong)
//   return (
//     <ToastProvider>
//       <SettingsProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <UIProvider>
//               <CacheProvider>
//                 <StorageProvider>
//                   <APIProvider>
//                     {/* ✅ AuthProvider phải bọc ngoài DataProvider để login có thể gọi API */}
//                     <AuthProvider>
//                       <DataProvider>
//                         <DataSyncProvider>{children}</DataSyncProvider>
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

// // 🔹 Các hook tiện ích để lấy state, dispatch, hoặc context root
// export const useAppState = () => React.useContext(AppContext).state;
// export const useAppDispatch = () => React.useContext(AppContext).dispatch;
// export const useAppContext = () => React.useContext(AppContext);
// export const useApp = () => React.useContext(AppContext);

// Đã check
import React, { createContext, useReducer, useMemo, useEffect } from "react";

import { appReducer } from "./reducers/appReducer";
import { initialAppState } from "./initialState";
import toastService from "../services/toastService";
import ToastProvider from "../components/Toast/ToastProvider";

// 🔹 MODULE PROVIDERS (theo thứ tự phụ thuộc)
import { NetworkProvider } from "./modules/NetworkContext";
import { DeviceProvider } from "./modules/DeviceContext";
import { SettingsProvider } from "./modules/SettingsContext";
import { UIProvider } from "./modules/UIContext";
import { AuthProvider } from "../context/AuthContext/AuthContext";
import { DataProvider } from "./modules/DataContext";
import { DataSyncProvider } from "./modules/DataSyncContext";
import { APIProvider } from "./APIContext/APIContext";
import { CacheProvider } from "./modules/CacheContext";
import { StorageProvider } from "./modules/StorageContext";

// 🔹 MODULE HOOKS (đồng bộ dữ liệu từ các context con)
import { useNetwork } from "../hooks/useNetwork";
import { useDevice } from "../hooks/useDevice";
import { useSettings } from "../hooks/useSettings";
import { useUI } from "../hooks/useUI";

// 🧠 AppContext: chứa toàn bộ AppState (root-level)
export const AppContext = createContext({
  state: initialAppState,
  dispatch: () => {},
});

// 🏗️ AppProvider: provider gốc bao bọc toàn bộ module context
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // 🔧 Gọi hook của các module để lấy dữ liệu runtime
  const { isOnline } = useNetwork();
  const { deviceInfo } = useDevice();
  const { theme, locale } = useSettings();
  const { toast } = useUI();

  // 🧩 Đồng bộ dữ liệu context con vào AppState
  useEffect(() => {
    dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
  }, [isOnline]);

  useEffect(() => {
    dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
  }, [deviceInfo]);

  useEffect(() => {
    dispatch({ type: "SETTINGS/INIT", payload: { theme, locale } });
  }, [theme, locale]);

  // 🧃 Toast listener: lắng nghe toast từ UIContext và gọi toastService hiển thị
  useEffect(() => {
    if (!toast) return; // ✅ Không có toast thì dừng ngay (tránh log spam)

    const { type, message, title } = toast;

    // ✅ Hiển thị toast
    toastService.show(type || "info", message, title);

    // ✅ Dùng timeout nhỏ để tránh CLEAR_TOAST chạy trước khi show hoàn tất
    const timer = setTimeout(() => {
      dispatch({ type: "UI/CLEAR_TOAST" }); // xoá toast sau khi hiển thị xong
    }, 50);

    // ✅ Dọn timer khi effect cleanup (tránh memory leak nếu toast thay đổi nhanh)
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  // 🌐 Lắng nghe sự kiện online/offline toàn cục
  useEffect(() => {
    const onOnline = () => {
      dispatch({ type: "NETWORK/SET_ONLINE", payload: true });
      toastService.show("success", "Bạn đã trực tuyến trở lại", "Online");
    };
    const onOffline = () => {
      dispatch({ type: "NETWORK/SET_ONLINE", payload: false });
      toastService.show("error", "Mất kết nối mạng", "Offline");
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // 🧠 Gộp state + dispatch thành 1 object duy nhất
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  // 🧩 Cấu trúc provider theo dependency thực tế (từ ngoài → trong)
  return (
    <AppContext.Provider value={value}>
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
                          <DataSyncProvider>{children}</DataSyncProvider>
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
    </AppContext.Provider>
  );
};

// 🔹 Các hook tiện ích để lấy state, dispatch, hoặc context root
export const useAppState = () => React.useContext(AppContext).state;
export const useAppDispatch = () => React.useContext(AppContext).dispatch;
export const useAppContext = () => React.useContext(AppContext);
export const useApp = () => React.useContext(AppContext);

// AppContext wrap tất cả module
