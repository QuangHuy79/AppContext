// src/runtime/useRuntimeReady.js
import { useEffect, useState } from "react";

const DEFAULT_TIMEOUT = 1500; // ms – chống UI chết

export function useRuntimeReady(required = []) {
  const [readyMap, setReadyMap] = useState({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const onReady = (e) => {
      const name = e.detail?.provider;
      if (!name) return;

      setReadyMap((prev) => ({ ...prev, [name]: true }));
    };

    window.addEventListener("app:provider:ready", onReady);

    // ⏱️ SAFETY UNLOCK – CỰC KỲ QUAN TRỌNG
    const timer = setTimeout(() => {
      if (mounted) {
        setIsReady(true);
      }
    }, DEFAULT_TIMEOUT);

    return () => {
      mounted = false;
      clearTimeout(timer);
      window.removeEventListener("app:provider:ready", onReady);
    };
  }, []);

  useEffect(() => {
    if (!required.length) {
      setIsReady(true);
      return;
    }

    const ok = required.every((k) => readyMap[k]);
    if (ok) setIsReady(true);
  }, [readyMap, required]);

  return isReady;
}
