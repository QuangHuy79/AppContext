/**
 * 🔒 CORE STABILITY ZONE — SNAPSHOT CONTRACT
 * ---------------------------------
 * Snapshot = production passport
 * Contract locked after Phase 6.3
 *
 * DO NOT add/remove domains
 */

// buildSnapshot.js — PHASE 6.3 COMPLIANT (LOCKABLE)
// src/obs/buildSnapshot.js
// PHASE 4.3 — SNAPSHOT CONTRACT (LOCKED FOR PHASE 6.3)

export function buildSnapshot() {
  const snapshot = {
    network: {
      online: Boolean(navigator.onLine),
      effectiveType: navigator.connection?.effectiveType || "unknown",
    },

    device: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      memory: navigator.deviceMemory || null,
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth <= 768,
      isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      isDesktop: window.innerWidth > 1024,
    },

    runtime: {
      env: import.meta.env.MODE,
      dev: import.meta.env.DEV,
    },

    // 🔒 ROOT-LEVEL TIMESTAMP (SNAPSHOT CONTRACT)
    timestamp: Date.now(),
  };

  // DEV: freeze snapshot to prevent mutation
  if (import.meta.env.DEV) {
    Object.freeze(snapshot);
    Object.values(snapshot).forEach((v) => {
      if (v && typeof v === "object") {
        Object.freeze(v);
      }
    });
  }

  return snapshot;
}
