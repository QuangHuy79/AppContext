// src/context/modules/DataContext.jsx
import React, {
  createContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from "react";
import { dataService } from "../../services/dataService";

/* --------------------------------------------------
   1️⃣ Context (STORE + ACTIONS ONLY)
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
   3️⃣ Reducer (PURE)
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

  /**
   * Store ref giữ snapshot mới nhất
   * → Context value KHÔNG đổi khi state đổi
   */
  const storeRef = useRef(state);
  storeRef.current = state;

  // mounted ref
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* -----------------------------
     Actions (STABLE + mounted-safe)
  ------------------------------ */
  const loadData = useCallback(async () => {
    if (!mountedRef.current) return;

    dispatch({ type: "DATA/LOADING", payload: true });
    try {
      const result = await dataService.fetchAll();
      if (mountedRef.current) {
        dispatch({ type: "DATA/SET_ALL", payload: result });
      }
    } catch (err) {
      if (mountedRef.current) {
        dispatch({ type: "DATA/ERROR", payload: err });
      }
    } finally {
      if (mountedRef.current) {
        dispatch({ type: "DATA/LOADING", payload: false });
      }
    }
  }, []);

  const updateData = useCallback(async (key, value) => {
    if (!mountedRef.current) return;

    dispatch({ type: "DATA/UPDATE", payload: { key, value } });
    try {
      await dataService.save(key, value);
    } catch (err) {
      if (mountedRef.current) {
        dispatch({ type: "DATA/ERROR", payload: err });
      }
    }
  }, []);

  const resetData = useCallback(async () => {
    if (!mountedRef.current) return;

    dispatch({ type: "DATA/RESET" });
    try {
      await dataService.clear();
    } catch (err) {
      if (mountedRef.current) {
        dispatch({ type: "DATA/ERROR", payload: err });
      }
    }
  }, []);

  const value = { storeRef, loadData, updateData, resetData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/* --------------------------------------------------
   5️⃣ Base Hook (INTERNAL USE)
-------------------------------------------------- */
const useDataStore = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

/* --------------------------------------------------
   6️⃣ Selector Hook (PUBLIC API)
-------------------------------------------------- */
export const useDataSelector = (selector) => {
  const { storeRef } = useDataStore();
  return selector(storeRef.current);
};

/* --------------------------------------------------
   7️⃣ Action Hook (PUBLIC API)
-------------------------------------------------- */
export const useDataActions = () => {
  const { loadData, updateData, resetData } = useDataStore();
  return { loadData, updateData, resetData };
};
