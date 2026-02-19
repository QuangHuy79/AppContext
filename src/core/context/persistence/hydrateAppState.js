// // src / context / persistence/hydrateAppState.js;
// import { initialAppState } from "../initialState";

// /* --------------------------------------------------
//    PERSISTENCE GUARD — SCHEMA DRIFT PROTECTION
//    FAIL CLOSED
// -------------------------------------------------- */
// export const hydrateAppState = (persisted) => {
//   // ❌ invalid root
//   if (!persisted || typeof persisted !== "object") {
//     return initialAppState;
//   }

//   // ❌ foreign domain injection
//   const allowedRootKeys = ["settings"];
//   for (const key of Object.keys(persisted)) {
//     if (!allowedRootKeys.includes(key)) {
//       return initialAppState;
//     }
//   }

//   const { settings } = persisted;

//   // ❌ missing settings
//   if (!settings || typeof settings !== "object") {
//     return initialAppState;
//   }

//   const baseSettings = initialAppState.settings;

//   const baseKeys = Object.keys(baseSettings);
//   const incomingKeys = Object.keys(settings);

//   // ❌ extra OR missing key
//   if (
//     incomingKeys.length !== baseKeys.length ||
//     !incomingKeys.every((k) => baseKeys.includes(k))
//   ) {
//     return initialAppState;
//   }

//   // ❌ type mismatch
//   for (const key of baseKeys) {
//     if (typeof settings[key] !== typeof baseSettings[key]) {
//       return initialAppState;
//     }
//   }

//   // ✅ schema matches exactly
//   return {
//     ...initialAppState,
//     settings: {
//       ...settings,
//     },
//   };
// };

// =====================================
// src/context/persistence/hydrateAppState.js

import { initialAppState } from "../initialState";
import { stateMigrations } from "../stateMigrations";
import { CURRENT_STATE_VERSION } from "../stateVersion";

/* --------------------------------------------------
   PERSISTENCE GUARD — SCHEMA DRIFT PROTECTION
   + VERSIONED MIGRATION
   FAIL CLOSED
-------------------------------------------------- */
export const hydrateAppState = (persisted) => {
  // ❌ invalid root
  if (!persisted || typeof persisted !== "object") {
    return initialAppState;
  }

  /* ===============================
     VERSION + MIGRATION (7.2)
  =============================== */
  const incomingVersion = persisted.stateVersion;

  // ❌ missing / invalid version
  if (typeof incomingVersion !== "number") {
    return initialAppState;
  }

  // ❌ future version → rollback
  if (incomingVersion > CURRENT_STATE_VERSION) {
    return initialAppState;
  }

  let workingState = persisted;

  // 🔁 migrate step-by-step
  for (let v = incomingVersion + 1; v <= CURRENT_STATE_VERSION; v++) {
    const migrate = stateMigrations[v];
    if (typeof migrate !== "function") {
      return initialAppState;
    }

    try {
      workingState = migrate(workingState);
    } catch {
      return initialAppState;
    }
  }

  /* ===============================
     EXISTING SCHEMA GUARD (GIỮ NGUYÊN)
  =============================== */

  // ❌ foreign domain injection
  const allowedRootKeys = ["stateVersion", "settings"];
  for (const key of Object.keys(workingState)) {
    if (!allowedRootKeys.includes(key)) {
      return initialAppState;
    }
  }

  const { settings } = workingState;

  // ❌ missing settings
  if (!settings || typeof settings !== "object") {
    return initialAppState;
  }

  const baseSettings = initialAppState.settings;

  const baseKeys = Object.keys(baseSettings);
  const incomingKeys = Object.keys(settings);

  // ❌ extra OR missing key
  if (
    incomingKeys.length !== baseKeys.length ||
    !incomingKeys.every((k) => baseKeys.includes(k))
  ) {
    return initialAppState;
  }

  // ❌ type mismatch
  for (const key of baseKeys) {
    if (typeof settings[key] !== typeof baseSettings[key]) {
      return initialAppState;
    }
  }

  // ✅ schema matches exactly
  return {
    ...initialAppState,
    settings: {
      ...settings,
    },
  };
};
