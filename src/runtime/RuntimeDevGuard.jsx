// // // src/runtime/RuntimeDevGuard.jsx
// // import RuntimeDebugger from "../debug/RuntimeDebugger";

// // export default function RuntimeDevGuard({ children }) {
// //   if (import.meta.env.PROD) {
// //     return children;
// //   }

// //   return (
// //     <>
// //       {children}
// //       <RuntimeDebugger />
// //     </>
// //   );
// // }

// ==============================
// src/runtime/RuntimeDevGuard.jsx
export default function RuntimeDevGuard({ children }) {
  return children;
}

// ===================================
// RuntimeDevGuard (CHỈ DEV, KHÔNG LOGIC)
// import RuntimeDebugger from "../debug/RuntimeDebugger";

// export default function RuntimeDevGuard({ children }) {
//   if (import.meta.env.PROD) return children;

//   return (
//     <>
//       {children}
//       <RuntimeDebugger />
//     </>
//   );
// }
