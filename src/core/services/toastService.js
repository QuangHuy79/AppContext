// // src/services/toastService.js
// // Tiny shared service used as a bridge to the ToastProvider instance.
// // Initially a noop so calling it before ToastProvider mounts won't crash.
// const toastService = {
//   // show(type, message, title, duration)
//   show: (..._args) => {
//     // noop or optional console to help debug during development
//     if (process.env.NODE_ENV === "development") {
//       // eslint-disable-next-line no-console
//       console.warn(
//         "[toastService] not initialized yet. Call ignored.",
//         ..._args
//       );
//     }
//   },

//   // Optional clear or remove API placeholders (not required)
//   remove: (/* id */) => {
//     if (process.env.NODE_ENV === "development") {
//       // eslint-disable-next-line no-console
//       console.warn("[toastService.remove] not initialized yet.");
//     }
//   },

//   // Internal registration used by ToastProvider
//   __register(showFn, removeFn) {
//     this.show = showFn || this.show;
//     if (removeFn) this.remove = removeFn;
//   },

//   // Optional unregister during cleanup
//   __unregister() {
//     // restore to noop
//     this.show = (..._args) => {
//       if (process.env.NODE_ENV === "development") {
//         // eslint-disable-next-line no-console
//         console.warn(
//           "[toastService] not initialized yet. Call ignored.",
//           ..._args
//         );
//       }
//     };
//     this.remove = () => {};
//   },
// };

// export default toastService;

// ===================================================
// PHIÊN BẢN LOCKED — FINAL (RECOMMENDED)
// src/services/toastService.js
// Tiny shared service used as a bridge to the ToastProvider instance.
// Safe noop by default — MUST stay silent.

const toastService = {
  // show(type, message, title, duration)
  show: () => {
    // noop — intentionally silent
  },

  remove: () => {
    // noop
  },

  // Internal registration used by ToastProvider
  __register(showFn, removeFn) {
    if (typeof showFn === "function") {
      this.show = showFn;
    }
    if (typeof removeFn === "function") {
      this.remove = removeFn;
    }
  },

  // Optional unregister during cleanup
  __unregister() {
    this.show = () => {};
    this.remove = () => {};
  },
};

export default toastService;
