// src/context/StatePersistenceContext.jsx — FINAL (PHASE 5.3 LOCKED)
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "./AppContext";
import { stateMigrations } from "./stateMigrations";

/* --------------------------------------------------
   Default loading (SAFE)
-------------------------------------------------- */
const DefaultLoadingPlaceholder = () => (
  <div data-testid="hydration-loading">Initializing App...</div>
);

/* --------------------------------------------------
   StatePersistenceProvider
-------------------------------------------------- */
export const StatePersistenceProvider = ({
  children,
  persistKey,
  version,
  loadingComponent,
}) => {
  const dispatch = useAppDispatch(); // dispatch-only
  const [isReady, setIsReady] = useState(false);

  const hasHydratedRef = useRef(false);
  const hasLoggedRef = useRef(false); // 🔒 LOG LATCH (DEV ONLY)

  useEffect(() => {
    // ❌ No persistence configured → skip hydrate
    if (!persistKey) {
      setIsReady(true);
      return;
    }

    // 🔒 Hydrate ONCE
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    let deniedDomains = [];

    try {
      if (typeof window === "undefined") {
        setIsReady(true);
        return;
      }

      const raw = localStorage.getItem(persistKey);
      if (!raw) {
        setIsReady(true);
        return;
      }

      const parsed = JSON.parse(raw);

      /* ---------------------------------------------
         EXACT VERSION — hydrate directly
      ---------------------------------------------- */
      if (parsed?.version === version && parsed?.state) {
        dispatch({
          type: "HYDRATE_APP_STATE",
          payload: parsed.state,
        });

        // DEV audit — whitelist enforcement
        deniedDomains = Object.keys(parsed.state).filter(
          (key) => key !== "settings",
        );
      }

      /* ---------------------------------------------
         LOWER VERSION — migrate deterministically
      ---------------------------------------------- */
      if (parsed?.version < version && parsed?.state) {
        const migrate = stateMigrations[parsed.version];

        if (typeof migrate === "function") {
          const migratedState = migrate(parsed.state);

          dispatch({
            type: "HYDRATE_APP_STATE",
            payload: migratedState,
          });

          deniedDomains = Object.keys(migratedState).filter(
            (key) => key !== "settings",
          );
        }
      }
    } catch {
      // Corrupted state → discard safely
      try {
        localStorage.removeItem(persistKey);
      } catch {}
    } finally {
      /* ---------------------------------------------
         DEV AUDIT LOG (ONCE)
      ---------------------------------------------- */
      if (
        import.meta.env.DEV &&
        deniedDomains.length > 0 &&
        !hasLoggedRef.current
      ) {
        hasLoggedRef.current = true;
        console.warn(
          "[Persistence] DENIED domains were NOT persisted:",
          deniedDomains,
        );
      }

      setIsReady(true);
    }
  }, [dispatch, persistKey, version]);

  /* --------------------------------------------------
     Hydration gate
  -------------------------------------------------- */
  if (!isReady) {
    const Loading = loadingComponent || DefaultLoadingPlaceholder;
    return <Loading />;
  }

  return children;
};
