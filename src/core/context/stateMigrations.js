/**
 * 🔒 CORE STABILITY ZONE — STATE MIGRATIONS
 * ---------------------------------
 * Deterministic, versioned, irreversible
 * DO NOT CHANGE without migration tests
 *
 * Locked after Phase 6
 */

// src/context/stateMigrations.js
export const stateMigrations = {
  1: (prevState) => {
    // v1 → v2
    return {
      settings: prevState.settings ?? {},
    };
  },
};
