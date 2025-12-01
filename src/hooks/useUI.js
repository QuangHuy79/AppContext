// src/hooks/useUI.js
import { useRef, useCallback } from "react";
import { useApp } from "../hooks/useApp";

/**
 * useUI - public API for UI concerns
 * Exposes:
 *  - sidebarOpen, toggleSidebar, setSidebar
 *  - toast, showToast, clearToast
 *  - loading, setLoading
 *
 * NOTE: hook runs in React component context (can use timers).
 */
export function useUI() {
  const { state, dispatch } = useApp();

  // keep current toast timeout to clear if new toast arrives / unmount
  const toastTimerRef = useRef(null);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "UI/TOGGLE_SIDEBAR" });
  }, [dispatch]);

  const setSidebar = useCallback(
    (value) => dispatch({ type: "UI/SET_SIDEBAR", payload: !!value }),
    [dispatch]
  );

  const showToast = useCallback(
    (payload = { message: "", type: "info" }, ttl = 2500) => {
      // clear existing timer
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      // normalize payload
      const toast = {
        id: Date.now(),
        message: payload.message ?? String(payload),
        type: payload.type ?? "info",
        meta: payload.meta ?? null,
      };
      dispatch({ type: "UI/SHOW_TOAST", payload: toast });

      // auto clear
      toastTimerRef.current = setTimeout(() => {
        dispatch({ type: "UI/CLEAR_TOAST" });
        toastTimerRef.current = null;
      }, ttl);
    },
    [dispatch]
  );

  const clearToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    dispatch({ type: "UI/CLEAR_TOAST" });
  }, [dispatch]);

  const setLoading = useCallback(
    (isLoading) => dispatch({ type: "UI/SET_LOADING", payload: !!isLoading }),
    [dispatch]
  );

  return {
    // state
    sidebarOpen: state.ui.sidebarOpen,
    toast: state.ui.toast,
    loading: state.ui.loading,

    // actions
    toggleSidebar,
    setSidebar,
    showToast,
    clearToast,
    setLoading,
  };
}
