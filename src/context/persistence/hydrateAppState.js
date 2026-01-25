import { initialAppState } from "../initialState";

/* --------------------------------------------------
   PERSISTENCE GUARD — SCHEMA DRIFT PROTECTION
   FAIL CLOSED
-------------------------------------------------- */
export const hydrateAppState = (persisted) => {
  // ❌ invalid root
  if (!persisted || typeof persisted !== "object") {
    return initialAppState;
  }

  // ❌ foreign domain injection
  const allowedRootKeys = ["settings"];
  for (const key of Object.keys(persisted)) {
    if (!allowedRootKeys.includes(key)) {
      return initialAppState;
    }
  }

  const { settings } = persisted;

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
