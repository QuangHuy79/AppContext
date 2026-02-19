// // src/context/wrappers/APIProviderWrapper.jsx
// import React, { useEffect } from "react";
// import { APIProvider } from "../APIContext/APIContext";

// // 🔔 chuẩn normalize: emit event khi provider này READY
// function emitReady(name) {
//   try {
//     window.dispatchEvent(
//       new CustomEvent("app:provider:ready", {
//         detail: { provider: name.toLowerCase() },
//       })
//     );
//   } catch (e) {
//     console.warn("emitReady failed", e);
//   }
// }

// export default function APIProviderWrapper({ children }) {
//   // Khi provider mount → AppRuntime v2 sẽ nhận tín hiệu “api ready”
//   useEffect(() => {
//     emitReady("api");
//   }, []);

//   return <APIProvider>{children}</APIProvider>;
// }

// ==========================================
// FILE SAU KHI LÀM SẠCH (FINAL)
// src/context/wrappers/APIProviderWrapper.jsx
import React, { useEffect } from "react";
import { APIProvider } from "../APIContext/APIContext";

// 🔔 emit runtime signal khi provider READY
function emitReady(name) {
  try {
    window.dispatchEvent(
      new CustomEvent("app:provider:ready", {
        detail: { provider: name.toLowerCase() },
      })
    );
  } catch {
    // intentionally ignored
  }
}

export default function APIProviderWrapper({ children }) {
  useEffect(() => {
    emitReady("api");
  }, []);

  return <APIProvider>{children}</APIProvider>;
}
