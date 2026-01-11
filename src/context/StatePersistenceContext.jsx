// // BẢN FULL FILE — StatePersistenceContext.jsx (AFTER FIX)
// // src/context/StatePersistenceContext.jsx
// import { useEffect, useRef, useState } from "react";
// import { useAppDispatch, useAppState } from "./AppContext";

// const DefaultLoadingPlaceholder = () => (
//   <div data-testid="hydration-loading">Initializing App...</div>
// );

// /* ==================================================
//    🔐 PERSIST WHITELIST — LOCKED (PHASE 4.4.3)
// ================================================== */
// const PERSIST_ALLOW = ["settings"];

// function filterPersistState(state) {
//   const output = {};

//   for (const key of PERSIST_ALLOW) {
//     if (key in state) {
//       output[key] = state[key];
//     }
//   }

//   if (import.meta.env.DEV) {
//     const deniedKeys = Object.keys(state).filter(
//       (k) => !PERSIST_ALLOW.includes(k)
//     );
//     if (deniedKeys.length > 0) {
//       console.warn(
//         "[Persistence] DENIED domains were NOT persisted:",
//         deniedKeys
//       );
//     }
//   }

//   return output;
// }

// export const StatePersistenceProvider = ({
//   children,
//   persistKey,
//   version,
//   loadingComponent,
// }) => {
//   const dispatch = useAppDispatch(); // dispatch-only
//   const state = useAppState(); // READ-ONLY
//   const [isReady, setIsReady] = useState(false);
//   const hasHydratedRef = useRef(false);

//   /* -----------------------------
//      HYDRATION (SAFE)
//   ------------------------------ */
//   useEffect(() => {
//     if (!persistKey) {
//       setIsReady(true);
//       return;
//     }

//     if (hasHydratedRef.current) return;
//     hasHydratedRef.current = true;

//     try {
//       const saved = localStorage.getItem(persistKey);
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         if (parsed.version === version && parsed.state) {
//           dispatch({
//             type: "HYDRATE_APP_STATE",
//             payload: parsed.state,
//           });
//         }
//       }
//     } catch {
//       try {
//         localStorage.removeItem(persistKey);
//       } catch {}
//     } finally {
//       setIsReady(true);
//     }
//   }, [dispatch, persistKey, version]);
//   useEffect(() => {
//     if (!persistKey || !isReady) return;

//     try {
//       const allowedState = {
//         settings: {
//           theme: state.settings.theme,
//           locale: state.settings.locale,
//           currency: state.settings.currency,
//         },
//       };

//       const payload = {
//         version,
//         state: allowedState,
//       };

//       localStorage.setItem(persistKey, JSON.stringify(payload));
//     } catch (err) {
//       console.warn("[Persistence] Failed to persist state", err);
//     }
//   }, [
//     isReady,
//     persistKey,
//     version,
//     state.settings.theme,
//     state.settings.locale,
//     state.settings.currency,
//   ]);

//   /* -----------------------------
//      PERSIST (WHITELISTED ONLY)
//   ------------------------------ */
//   useEffect(() => {
//     if (!persistKey) return;

//     try {
//       const safeState = filterPersistState(state);

//       localStorage.setItem(
//         persistKey,
//         JSON.stringify({
//           version,
//           state: safeState,
//         })
//       );
//     } catch {
//       // silent by design (security > UX)
//     }
//   }, [state, persistKey, version]);

//   if (!isReady) {
//     const Loading = loadingComponent || DefaultLoadingPlaceholder;
//     return <Loading />;
//   }

//   return children;
// };

// =======================================
// FILE FULL — src/context/StatePersistenceContext.jsx (FIX LOG NOISE)
// src/context/StatePersistenceContext.jsx
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "./AppContext";

const DefaultLoadingPlaceholder = () => (
  <div data-testid="hydration-loading">Initializing App...</div>
);

export const StatePersistenceProvider = ({
  children,
  persistKey,
  version,
  loadingComponent,
}) => {
  const dispatch = useAppDispatch(); // dispatch-only
  const [isReady, setIsReady] = useState(false);

  const hasHydratedRef = useRef(false);
  const hasLoggedRef = useRef(false); // 🔒 LOG LATCH

  useEffect(() => {
    if (!persistKey) {
      setIsReady(true);
      return;
    }

    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    let deniedDomains = [];

    try {
      const raw = localStorage.getItem(persistKey);
      if (raw) {
        const parsed = JSON.parse(raw);

        if (parsed?.version === version && parsed?.state) {
          dispatch({
            type: "HYDRATE_APP_STATE",
            payload: parsed.state,
          });

          // detect denied domains (DEV audit only)
          deniedDomains = Object.keys(parsed.state).filter(
            (key) => key !== "settings"
          );
        }
      }
    } catch (_) {
      try {
        localStorage.removeItem(persistKey);
      } catch {}
    } finally {
      // 🔕 LOG ONLY ONCE PER PAGE LOAD
      if (
        import.meta.env.DEV &&
        deniedDomains.length > 0 &&
        !hasLoggedRef.current
      ) {
        hasLoggedRef.current = true;
        console.warn(
          "[Persistence] DENIED domains were NOT persisted:",
          deniedDomains
        );
      }

      setIsReady(true);
    }
  }, [dispatch, persistKey, version]);

  if (!isReady) {
    const Loading = loadingComponent || DefaultLoadingPlaceholder;
    return <Loading />;
  }

  return children;
};
