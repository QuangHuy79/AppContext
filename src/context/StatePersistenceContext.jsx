// // Đây là file StatePersistenceContext.jsx đã được hoàn thiện,
// // đã áp dụng rào chắn (guard clause) vào useEffect đầu tiên để xử lý
// // lỗi undefined trong môi trường Vitest mà không ảnh hưởng đến Production.
// // StatePersistenceContext.jsx (Phiên bản Cuối cùng)
// // src/context/StatePersistenceContext.jsx (Refactored for Production Readiness)
// import React, {
//   createContext,
//   // 💡 useContext, (Không cần dùng trực tiếp, chỉ cần dùng hook)
//   useEffect,
//   useState, // Dùng để chặn render
//   useRef,
// } from "react";
// import { useApp } from "./AppContext";

// // Context rỗng
// const StatePersistenceContext = createContext();

// // Component tĩnh cho loading (nên được custom/truyền từ AppRuntimeWrapper)
// const DefaultLoadingPlaceholder = () => (
//   <div data-testid="hydration-loading">Initializing App...</div>
// );

// export const StatePersistenceProvider = ({
//   children,
//   persistKey, // 🔑 NEW: key động (ví dụ: 'app_v2_state')
//   version, // 🔢 NEW: version động (ví dụ: 2)
//   loadingComponent, // ⏳ NEW: Component hiển thị khi đang chặn render
// }) => {
//   const { state, dispatch } = useApp();
//   // ⭐️ Dùng useState để chặn/mở khóa render tree
//   const [isReady, setIsReady] = useState(false);
//   const saveTimeout = useRef(null);

//   // --- 1️⃣ Khôi phục & Khởi tạo (Blocking Logic) ---
//   useEffect(() => {
//     // 🛡️ FIX CHO VITEST: Ngăn lỗi undefined do timing trong môi trường test
//     if (!persistKey) {
//       // console.warn(
//       //   "[HYDRATE] Skipping restore because persistKey is undefined (Test environment potential issue)."
//       // );
//       // // Mở khóa ngay lập tức để tránh treo app trong môi trường test nếu key không có
//       // setIsReady(true);
//       // ⭐️ Dùng console.error để Vitest/Mocks xử lý mạnh mẽ hơn
//       console.error(
//         "[HYDRATE] Skipping restore because persistKey is undefined (Test environment timing issue)."
//       );
//       setIsReady(true);
//       return;
//     }

//     let mounted = true;

//     const restoreState = () => {
//       try {
//         const saved = localStorage.getItem(persistKey);

//         if (saved) {
//           const parsed = JSON.parse(saved);

//           // ⚠️ Xử lý Versioning (BẮT BUỘC)
//           if (parsed.version !== version) {
//             console.warn(
//               `[HYDRATE] Version mismatch. Current: ${version}, Saved: ${parsed.version}. Skipping restore.`
//             );
//           } else {
//             console.log(
//               "[HYDRATE] Restoring state from localStorage:",
//               persistKey
//             );

//             // Gửi action khôi phục state
//             dispatch({
//               type: "HYDRATE_APP_STATE",
//               payload: parsed,
//             });
//           }
//         } else {
//           console.log("[HYDRATE] No saved state found.");
//         }
//       } catch (err) {
//         // ⚠️ Xử lý lỗi JSON Parse/Corrupt (BẮT BUỘC)
//         console.error(
//           "[HYDRATE ERROR] Failed to parse saved state. Clearing corrupted data.",
//           err
//         );
//         localStorage.removeItem(persistKey);
//       } finally {
//         // ⭐️ Luôn mở khóa render sau khi thử khôi phục
//         if (mounted) {
//           setIsReady(true);
//         }
//       }
//     };

//     restoreState();

//     return () => {
//       mounted = false;
//     };
//   }, [dispatch, persistKey, version]); // Dependencies cần có

//   // --- 2️⃣ Lưu state vào localStorage (Debounced Save) ---
//   useEffect(() => {
//     // 💡 Chỉ bắt đầu lưu khi đã SẴN SÀNG (isReady=true)
//     if (!isReady || !persistKey) return;

//     if (saveTimeout.current) clearTimeout(saveTimeout.current);
//     saveTimeout.current = setTimeout(() => {
//       try {
//         localStorage.setItem(persistKey, JSON.stringify({ ...state, version }));
//       } catch (err) {
//         // ⚠️ Xử lý lỗi Quota Exceeded/SecurityError (BẮT BUỘC)
//         if (err.name === "QuotaExceededError" || err.name === "SecurityError") {
//           console.error(
//             "[SAVE ERROR] Storage Quota Exceeded or security issue. State saving stopped.",
//             err
//           );
//           return;
//         }
//         console.error("[SAVE ERROR] Failed to save app state.", err);
//       }
//     }, 500); // debounce 500ms

//     // cleanup khi unmount
//     return () => {
//       if (saveTimeout.current) clearTimeout(saveTimeout.current);
//     };
//   }, [state, isReady, persistKey, version]);

//   // --- 3️⃣ Logic Chặn Render (Blocking Render) ---
//   if (!isReady) {
//     // 🛑 Trả về Loading/Null khi isReady=false
//     const LoadingComp = loadingComponent || DefaultLoadingPlaceholder;
//     return <LoadingComp />;
//   }

//   // ⭐️ Cho phép render children (Full Runtime)
//   return (
//     <StatePersistenceContext.Provider value={{}}>
//       {children}
//     </StatePersistenceContext.Provider>
//   );
// };

// ========================================
// StatePersistenceContext.jsx — bản đã refactor (Task C-1, ready-to-drop)
// src/context/StatePersistenceContext.jsx (Refactored for Production Readiness)
import React, {
  createContext,
  // 💡 useContext, (Không cần dùng trực tiếp, chỉ cần dùng hook)
  useEffect,
  useState, // Dùng để chặn render
  useRef,
} from "react";
import { useApp } from "./AppContext";

// Context rỗng
const StatePersistenceContext = createContext();

// Component tĩnh cho loading (nên được custom/truyền từ AppRuntimeWrapper)
const DefaultLoadingPlaceholder = () => (
  <div data-testid="hydration-loading">Initializing App...</div>
);

export const StatePersistenceProvider = ({
  children,
  persistKey, // 🔑 NEW: key động (ví dụ: 'app_v2_state')
  version, // 🔢 NEW: version động (ví dụ: 2)
  loadingComponent, // ⏳ NEW: Component hiển thị khi đang chặn render
}) => {
  const { state, dispatch } = useApp();
  // ⭐️ Dùng useState để chặn/mở khóa render tree
  const [isReady, setIsReady] = useState(false);
  const saveTimeout = useRef(null);

  // 🛡️ Guard để ngăn double-hydrate (React StrictMode sẽ mount twice in dev)
  const hasHydratedRef = useRef(false);

  // --- 1️⃣ Khôi phục & Khởi tạo (Blocking Logic) ---
  useEffect(() => {
    // 🛡️ FIX CHO VITEST: Ngăn lỗi undefined do timing trong môi trường test
    if (!persistKey) {
      console.error(
        "[HYDRATE] Skipping restore because persistKey is undefined (Test environment timing issue)."
      );
      setIsReady(true);
      return;
    }

    let mounted = true;

    const restoreState = () => {
      // Prevent double-hydrate in StrictMode / accidental re-runs
      if (hasHydratedRef.current) {
        // already attempted hydrate once — skip subsequent attempts
        return;
      }
      hasHydratedRef.current = true;

      try {
        const saved = localStorage.getItem(persistKey);

        if (saved) {
          const parsed = JSON.parse(saved);

          // ⚠️ Xử lý Versioning (BẮT BUỘC)
          if (parsed.version !== version) {
            console.warn(
              `[HYDRATE] Version mismatch. Current: ${version}, Saved: ${parsed.version}. Skipping restore.`
            );
          } else {
            console.log(
              "[HYDRATE] Restoring state from localStorage:",
              persistKey
            );

            // Gửi action khôi phục state
            // NOTE: dispatch expected to be stable from AppProvider
            dispatch({
              type: "HYDRATE_APP_STATE",
              payload: parsed,
            });
          }
        } else {
          console.log("[HYDRATE] No saved state found.");
        }
      } catch (err) {
        // ⚠️ Xử lý lỗi JSON Parse/Corrupt (BẮT BUỘC)
        console.error(
          "[HYDRATE ERROR] Failed to parse saved state. Clearing corrupted data.",
          err
        );
        try {
          localStorage.removeItem(persistKey);
        } catch (removeErr) {
          // ignore remove error
        }
      } finally {
        // ⭐️ Luôn mở khóa render sau khi thử khôi phục
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    restoreState();

    return () => {
      mounted = false;
    };
  }, [dispatch, persistKey, version]); // Dependencies cần có

  // --- 2️⃣ Lưu state vào localStorage (Debounced Save) ---
  useEffect(() => {
    // 💡 Chỉ bắt đầu lưu khi đã SẴN SÀNG (isReady=true)
    if (!isReady || !persistKey) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(persistKey, JSON.stringify({ ...state, version }));
      } catch (err) {
        // ⚠️ Xử lý lỗi Quota Exceeded/SecurityError (BẮT BUỘC)
        if (
          err &&
          (err.name === "QuotaExceededError" || err.name === "SecurityError")
        ) {
          console.error(
            "[SAVE ERROR] Storage Quota Exceeded or security issue. State saving stopped.",
            err
          );
          return;
        }
        console.error("[SAVE ERROR] Failed to save app state.", err);
      }
    }, 500); // debounce 500ms

    // cleanup khi unmount
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = null;
      }
    };
  }, [state, isReady, persistKey, version]);

  // --- 3️⃣ Logic Chặn Render (Blocking Render) ---
  if (!isReady) {
    // 🛑 Trả về Loading/Null khi isReady=false
    const LoadingComp = loadingComponent || DefaultLoadingPlaceholder;
    return <LoadingComp />;
  }

  // ⭐️ Cho phép render children (Full Runtime)
  return (
    <StatePersistenceContext.Provider value={{}}>
      {children}
    </StatePersistenceContext.Provider>
  );
};
