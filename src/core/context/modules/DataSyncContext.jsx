// src/context/modules/DataSyncContext.jsx
import React, {
  createContext,
  useReducer,
  useCallback,
  useRef,
  useMemo,
  useEffect,
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

  // mounted ref
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // abortable controller for syncNow
  const controllerRef = useRef(null);

  /* -----------------------------
     Sync now (mounted-safe + cancelable)
  ------------------------------ */
  const syncNow = useCallback(async () => {
    if (state.syncing || !mountedRef.current) return;

    dispatch({ type: "SYNC/START" });

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      await dataService.fetchAll({ signal: controller.signal });
      if (mountedRef.current) {
        dispatch({ type: "SYNC/SUCCESS", payload: new Date() });
      }
    } catch (err) {
      // if (err.name === "AbortError") {
      //   console.warn("[DataSync] Sync aborted");
      // } else if (mountedRef.current) {
      //   dispatch({ type: "SYNC/ERROR", payload: err });
      // }
      if (err.name !== "AbortError" && mountedRef.current) {
        dispatch({ type: "SYNC/ERROR", payload: err });
      }
    } finally {
      controllerRef.current = null;
    }
  }, [state.syncing]);

  /* -----------------------------
     Reset sync state
  ------------------------------ */
  const resetSync = useCallback(() => {
    if (!mountedRef.current) return;

    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }

    dispatch({ type: "SYNC/RESET" });
  }, []);

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
