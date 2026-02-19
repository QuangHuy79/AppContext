// // src/services/storageService.js

// const storage = {
//   get(key, defaultValue = null) {
//     try {
//       const value = localStorage.getItem(key);
//       return value ? JSON.parse(value) : defaultValue;
//     } catch (error) {
//       console.error(`[storageService] Error getting ${key}:`, error);
//       return defaultValue;
//     }
//   },

//   set(key, value) {
//     try {
//       localStorage.setItem(key, JSON.stringify(value));
//     } catch (error) {
//       console.error(`[storageService] Error setting ${key}:`, error);
//     }
//   },

//   remove(key) {
//     try {
//       localStorage.removeItem(key);
//     } catch (error) {
//       console.error(`[storageService] Error removing ${key}:`, error);
//     }
//   },

//   clear() {
//     try {
//       localStorage.clear();
//     } catch (error) {
//       console.error("[storageService] Error clearing storage:", error);
//     }
//   },
// };

// export default storage;

// =======================================
// FILE FULL SAU KHI FIX — CLEAN & PROD-SAFE
// src/services/storageService.js

const storage = {
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // fail silently
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // fail silently
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch {
      // fail silently
    }
  },
};

export default storage;
