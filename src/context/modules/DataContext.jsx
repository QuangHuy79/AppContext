// // Toast chỉ chạy thông qua UIContext
// // src/context/modules/DataContext.jsx
// import React, { createContext, useEffect, useMemo, useContext } from "react";
// import { dataService } from "../../services/dataService";
// import { useAuth } from "../AuthContext/useAuth";
// import { useAppContext, useAppDispatch } from "../AppContext";

// // Context cho Data
// const DataContext = createContext(null);

// export const DataProvider = ({ children }) => {
//   const { user } = useAuth(); // user từ AuthContext
//   const { state } = useAppContext(); // root AppState
//   const dispatch = useAppDispatch(); // dispatch root AppState

//   // --- Load toàn bộ data (có thể gọi lại từ UI: Reload Data) ---
//   const loadData = async () => {
//     if (!user) {
//       // Nếu user null → reset data
//       dispatch({ type: "DATA/RESET" });

//       // Dispatch toast qua UIContext
//       dispatch({
//         type: "UI/SHOW_TOAST",
//         payload: { type: "info", message: "Data reset" },
//       });
//       return;
//     }

//     dispatch({ type: "DATA/LOADING", payload: true });

//     try {
//       const result = await dataService.fetchAll();
//       dispatch({ type: "DATA/SET_ALL", payload: result });

//       // Thông báo thành công qua UIContext
//       dispatch({
//         type: "UI/SHOW_TOAST",
//         payload: { type: "success", message: "Data loaded successfully" },
//       });
//     } catch (error) {
//       // Thông báo lỗi qua UIContext
//       dispatch({
//         type: "UI/SHOW_TOAST",
//         payload: { type: "error", message: "Failed to load data" },
//       });
//     } finally {
//       dispatch({ type: "DATA/LOADING", payload: false });
//     }
//   };

//   // --- Auto load khi user thay đổi ---
//   useEffect(() => {
//     loadData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   // --- Cập nhật 1 key-value ---
//   const updateData = async (key, value) => {
//     try {
//       dispatch({ type: "DATA/UPDATE", payload: { key, value } });
//       await dataService.save(key, value);

//       // Toast thông báo qua UIContext
//       dispatch({
//         type: "UI/SHOW_TOAST",
//         payload: { type: "info", message: `Updated "${key}" successfully` },
//       });
//     } catch (error) {
//       dispatch({
//         type: "UI/SHOW_TOAST",
//         payload: { type: "error", message: "Update failed" },
//       });
//     }
//   };

//   // --- Reset toàn bộ data ---
//   const resetData = async () => {
//     dispatch({ type: "DATA/RESET" });
//     await dataService.clear();

//     dispatch({
//       type: "UI/SHOW_TOAST",
//       payload: { type: "info", message: "All data cleared" },
//     });
//   };

//   // --- Gộp value để cung cấp ra ngoài ---
//   const value = useMemo(
//     () => ({
//       data: state.data,
//       updateData,
//       resetData,
//       loadData, // expose loadData để UI gọi
//     }),
//     [state.data]
//   );

//   return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
// };

// // Hook tiện lợi để lấy context
// export const useData = () => useContext(DataContext);

// ====================================
// Fix DataContext theo STEP 8”
// src/context/modules/DataContext.jsx
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
export const DataContext = createContext(null);

/* --------------------------------------------------
   2️⃣ Initial State
-------------------------------------------------- */
const initialState = {
  data: {},
  loading: false,
  error: null,
};

/* --------------------------------------------------
   3️⃣ Reducer
-------------------------------------------------- */
function dataReducer(state, action) {
  switch (action.type) {
    case "DATA/LOADING":
      return { ...state, loading: action.payload };

    case "DATA/SET_ALL":
      return { ...state, data: action.payload, error: null };

    case "DATA/UPDATE":
      return {
        ...state,
        data: { ...state.data, [action.payload.key]: action.payload.value },
      };

    case "DATA/RESET":
      return initialState;

    case "DATA/ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

/* --------------------------------------------------
   4️⃣ Provider
-------------------------------------------------- */
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  /* -----------------------------
     Load all data
  ------------------------------ */
  const loadData = useCallback(async () => {
    dispatch({ type: "DATA/LOADING", payload: true });
    try {
      const result = await dataService.fetchAll();
      dispatch({ type: "DATA/SET_ALL", payload: result });
    } catch (err) {
      dispatch({ type: "DATA/ERROR", payload: err });
    } finally {
      dispatch({ type: "DATA/LOADING", payload: false });
    }
  }, []);

  /* -----------------------------
     Update single key
  ------------------------------ */
  const updateData = useCallback(async (key, value) => {
    dispatch({ type: "DATA/UPDATE", payload: { key, value } });
    try {
      await dataService.save(key, value);
    } catch (err) {
      dispatch({ type: "DATA/ERROR", payload: err });
    }
  }, []);

  /* -----------------------------
     Reset data
  ------------------------------ */
  const resetData = useCallback(async () => {
    dispatch({ type: "DATA/RESET" });
    try {
      await dataService.clear();
    } catch (err) {
      dispatch({ type: "DATA/ERROR", payload: err });
    }
  }, []);

  /* --------------------------------------------------
     Memoized value
  -------------------------------------------------- */
  const value = useMemo(
    () => ({
      data: state.data,
      loading: state.loading,
      error: state.error,
      loadData,
      updateData,
      resetData,
    }),
    [state, loadData, updateData, resetData]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/* --------------------------------------------------
   5️⃣ Hook (SAFE)
-------------------------------------------------- */
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
};
