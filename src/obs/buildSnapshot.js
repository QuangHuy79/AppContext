// // src/obs/buildSnapshot.js
// export function buildSnapshot() {
//   const snapshot = {
//     network: {
//       online: Boolean(navigator.onLine),
//       effectiveType: navigator.connection?.effectiveType || "unknown",
//     },

//     device: {
//       userAgent: navigator.userAgent,
//       platform: navigator.platform,
//       memory: navigator.deviceMemory || null,
//       width: window.innerWidth,
//       height: window.innerHeight,
//       isMobile: window.innerWidth <= 768,
//       isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
//       isDesktop: window.innerWidth > 1024,
//     },

//     settings: {
//       env: import.meta.env.MODE,
//       dev: import.meta.env.DEV,
//     },

//     auth: {
//       status: "unknown", // hook sau sẽ fill
//     },

//     dataSummary: {
//       note: "summary-only", // placeholder
//     },
//   };

//   // DEV: freeze all objects to avoid accidental mutation
//   if (import.meta.env.DEV) {
//     Object.freeze(snapshot);
//     Object.values(snapshot).forEach((v) => {
//       if (v && typeof v === "object") Object.freeze(v);
//     });
//   }

//   return snapshot;
// }

// =================================================
// FILE FULL buildSnapshot.js (PHASE 4.3 LOCKED)
// src/obs/buildSnapshot.js

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
      timestamp: Date.now(),
    },
  };

  // DEV: freeze snapshot to prevent mutation
  if (import.meta.env.DEV) {
    Object.freeze(snapshot);
    Object.values(snapshot).forEach((v) => {
      if (v && typeof v === "object") Object.freeze(v);
    });
  }

  return snapshot;
}
