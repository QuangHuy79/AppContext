// // src/context/modules/DataSyncContext.jsx
// import React, {
//   createContext,
//   useState,
//   useCallback,
//   useEffect,
//   useContext,
//   useMemo,
// } from "react";
// import toastService from "../../services/toastService";
// import { dataService } from "../../services/dataService";

// // Hooks / contexts trong dự án (cùng folder modules)
// import { useNetwork } from "./NetworkContext";
// import { useCache } from "./CacheContext";
// import { useStorage } from "./StorageContext";
// import { useData } from "./DataContext";
// // Auth hook nằm ở context/AuthContext (theo cấu trúc dự án)
// import { useAuth } from "../AuthContext/useAuth";
// import { useUI } from "./UIContext";

// /**
//  * DataSyncContext
//  *
//  * Tính năng:
//  * - syncNow(): đồng bộ dữ liệu thủ công (guarded)
//  * - auto-sync: kiểm tra mỗi phút, nếu online + authenticated + lastSync > 10 phút => gọi syncNow()
//  * - lưu lastSync vào StorageContext (localStorage) để persist qua reload
//  *
//  * Lưu ý: không thêm queue/hàng đợi mới, không thay đổi kiến trúc bạn đã build.
//  */

// export const DataSyncContext = createContext({
//   lastSync: null,
//   syncing: false,
//   syncNow: async () => {},
// });

// export const DataSyncProvider = ({ children }) => {
//   // state nội bộ
//   const [lastSync, setLastSync] = useState(null);
//   const [syncing, setSyncing] = useState(false);

//   // integration với các module
//   const { isOnline } = useNetwork(); // kiểm tra network
//   const { user, isAuthenticated } = useAuth(); // kiểm tra auth
//   const { setCache } = useCache(); // cập nhật cache nếu cần
//   const { getItem, setItem } = useStorage(); // lưu lastSync vào storage
//   const { loadData } = useData() || {}; // loadData từ DataContext (nếu có)
//   const ui = useUI(); // Ui context (có dispatch và helpers)

//   // --------------------------------------------
//   // 1) syncNow: hàm gọi để đồng bộ thủ công
//   //    giữ logic gốc nhưng tích hợp loadData + lưu lastSync
//   // --------------------------------------------
//   const syncNow = useCallback(
//     async (opts = {}) => {
//       // opts có thể mở rộng (e.g., { showToasts: true })
//       const showToasts = opts.showToasts ?? true;

//       // guard: nếu đang đồng bộ thì bỏ qua
//       if (syncing) return;

//       // nếu offline => thông báo và bỏ qua
//       if (!isOnline) {
//         if (showToasts)
//           toastService.show(
//             "info",
//             "Bạn đang offline — đồng bộ bị hoãn",
//             "DataSync"
//           );
//         return;
//       }

//       // nếu chưa đăng nhập (tùy chính sách) => bỏ qua
//       if (!isAuthenticated) {
//         if (showToasts)
//           toastService.show(
//             "info",
//             "Chưa đăng nhập — không thể đồng bộ",
//             "DataSync"
//           );
//         return;
//       }

//       setSyncing(true);
//       if (showToasts)
//         toastService.show("info", "Bắt đầu đồng bộ dữ liệu...", "Đang đồng bộ");

//       try {
//         // --- giữ nguyên kiểu giả lập / call API như bạn có thể định nghĩa ---
//         // Khi có dataService.syncAll hoặc tương tự, gọi ở đây
//         // Dùng dataService.fetchAll() như một fallback / hiện thực mock
//         const serverData = await dataService.fetchAll();

//         // Nếu có DataContext.loadData, gọi để update AppState bằng reducer (data flow bạn dùng)
//         if (typeof loadData === "function") {
//           // loadData sẽ dispatch DATA/SET_ALL... trong DataContext
//           await loadData();
//         } else {
//           // nếu không có, cập nhật cache tạm
//           try {
//             setCache && setCache("data", serverData);
//           } catch (e) {
//             // ignore cache error
//           }
//         }

//         // lưu lastSync vào state + storage
//         const now = new Date();
//         setLastSync(now);
//         try {
//           setItem && setItem("lastSync", now.toISOString());
//         } catch (e) {
//           /* ignore storage write errors */
//         }

//         // toast success
//         if (showToasts)
//           toastService.show(
//             "success",
//             "Dữ liệu đã được đồng bộ thành công!",
//             "Hoàn tất"
//           );
//       } catch (error) {
//         console.error("[DataSync] syncNow failed:", error);
//         if (showToasts)
//           toastService.show(
//             "error",
//             "Không thể đồng bộ dữ liệu. Vui lòng thử lại.",
//             "Lỗi"
//           );
//       } finally {
//         setSyncing(false);
//       }
//     },
//     // các phụ thuộc: giữ nguyên sync guard và các hook
//     [isOnline, isAuthenticated, syncing, loadData, setCache, setItem]
//   );

//   // --------------------------------------------
//   // 2) Auto-sync: kiểm tra mỗi phút, gọi syncNow khi:
//   //    - online
//   //    - authenticated
//   //    - không đang sync
//   //    - lastSync không tồn tại hoặc đã quá 10 phút
//   // --------------------------------------------
//   useEffect(() => {
//     const checkIntervalMs = 60 * 1000; // kiểm tra mỗi phút
//     const TEN_MIN = 10 * 60 * 1000;

//     const tick = async () => {
//       try {
//         if (!isOnline) return;
//         if (!isAuthenticated) return;
//         if (syncing) return;

//         // đọc lastSync từ localStorage nếu chưa có state (tức vừa mount)
//         let persisted = null;
//         try {
//           persisted = getItem ? getItem("lastSync") : null;
//         } catch (e) {
//           persisted = null;
//         }

//         const lastMs = lastSync
//           ? new Date(lastSync).getTime()
//           : persisted
//           ? new Date(persisted).getTime()
//           : 0;
//         const needsSync = !lastMs || Date.now() - lastMs > TEN_MIN;

//         if (needsSync) {
//           // gọi syncNow (không hiện toast quá tải)
//           await syncNow({ showToasts: true });
//         }
//       } catch (err) {
//         // eslint-disable-next-line no-console
//         console.error("[DataSync] auto-sync tick error:", err);
//       }
//     };

//     const interval = setInterval(tick, checkIntervalMs);
//     // chạy 1 lần ngay khi mount để có phản ứng nhanh
//     tick().catch(() => {});
//     return () => clearInterval(interval);
//   }, [isOnline, isAuthenticated, syncing, lastSync, syncNow, getItem]);

//   // --------------------------------------------
//   // 3) On mount: restore lastSync from storage (nếu có)
//   // --------------------------------------------
//   useEffect(() => {
//     try {
//       const saved = getItem ? getItem("lastSync") : null;
//       if (saved) {
//         setLastSync(new Date(saved));
//       }
//     } catch (e) {
//       // ignore parse errors
//     }
//   }, [getItem]);

//   // --------------------------------------------
//   // 4) Sync value memo
//   // --------------------------------------------
//   const value = useMemo(
//     () => ({
//       lastSync,
//       syncedData: lastSync,
//       syncing,
//       syncNow,
//     }),
//     [lastSync, syncing, syncNow]
//   );

//   return (
//     <DataSyncContext.Provider value={value}>
//       {children}
//     </DataSyncContext.Provider>
//   );
// };

// export const useDataSync = () => useContext(DataSyncContext);

// ==============================
// BẢN FIX CHUẨN — DataSyncContext.jsx (STEP 8)
// src/context/modules/DataSyncContext.jsx
import React, {
  createContext,
  useReducer,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { dataService } from "../../services/dataService";

/* --------------------------------------------------
   1️⃣ Context
-------------------------------------------------- */
export const DataSyncContext = createContext(null);

/* --------------------------------------------------
   2️⃣ Initial State
-------------------------------------------------- */
const initialState = {
  lastSync: null,
  syncing: false,
  error: null,
};

/* --------------------------------------------------
   3️⃣ Reducer
-------------------------------------------------- */
function dataSyncReducer(state, action) {
  switch (action.type) {
    case "SYNC/START":
      return { ...state, syncing: true, error: null };

    case "SYNC/SUCCESS":
      return {
        ...state,
        syncing: false,
        lastSync: action.payload,
        error: null,
      };

    case "SYNC/ERROR":
      return { ...state, syncing: false, error: action.payload };

    case "SYNC/RESET":
      return initialState;

    default:
      return state;
  }
}

/* --------------------------------------------------
   4️⃣ Provider
-------------------------------------------------- */
export const DataSyncProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataSyncReducer, initialState);

  /* -----------------------------
     Sync now (NO POLICY)
  ------------------------------ */
  const syncNow = useCallback(async () => {
    if (state.syncing) return;

    dispatch({ type: "SYNC/START" });
    try {
      await dataService.fetchAll(); // hoặc syncAll khi có
      const now = new Date();
      dispatch({ type: "SYNC/SUCCESS", payload: now });
      return now;
    } catch (err) {
      dispatch({ type: "SYNC/ERROR", payload: err });
      throw err;
    }
  }, [state.syncing]);

  /* -----------------------------
     Reset sync state
  ------------------------------ */
  const resetSync = useCallback(() => {
    dispatch({ type: "SYNC/RESET" });
  }, []);

  /* --------------------------------------------------
     Memoized value
  -------------------------------------------------- */
  const value = useMemo(
    () => ({
      lastSync: state.lastSync,
      syncing: state.syncing,
      error: state.error,
      syncNow,
      resetSync,
    }),
    [state, syncNow, resetSync]
  );

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
};

/* --------------------------------------------------
   5️⃣ Hook (SAFE)
-------------------------------------------------- */
export const useDataSync = () => {
  const ctx = useContext(DataSyncContext);
  if (!ctx) {
    throw new Error("useDataSync must be used within DataSyncProvider");
  }
  return ctx;
};
