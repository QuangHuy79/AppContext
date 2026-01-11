// // Phiên bản giữ nguyên – chỉ format rõ ràng
// // src/main.jsx
// import React from "react";
// import ReactDOM from "react-dom/client";

// import App from "./App";
// import ErrorBoundary from "./obs/ErrorBoundary";
// import { registerGlobalErrors } from "./obs/registerGlobalErrors";
// import { captureError } from "./obs/errorSink";
// import { normalizeError } from "./obs/normalizeError";

// function bootstrap() {
//   // Register global runtime error hooks (E2, E3)
//   registerGlobalErrors();

//   ReactDOM.createRoot(document.getElementById("root")).render(
//     <ErrorBoundary>
//       <App />
//     </ErrorBoundary>
//   );
// }

// try {
//   bootstrap();
// } catch (err) {
//   // E4 – synchronous bootstrap crash
//   captureError(normalizeError(err, "E4"));
// }

// ==========================================
// main.jsx — BẢN SAU KHI FIX (CHUẨN 4.4.3)
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import ErrorBoundary from "./obs/ErrorBoundary";

import { AppProvider } from "./context/AppContext";
import { StatePersistenceProvider } from "./context/StatePersistenceContext";

import { registerGlobalErrors } from "./obs/registerGlobalErrors";
import { captureError } from "./obs/errorSink";
import { normalizeError } from "./obs/normalizeError";

function bootstrap() {
  registerGlobalErrors();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
      <StatePersistenceProvider persistKey="app_v2_state" version={2}>
        <AppProvider>
          <App />
        </AppProvider>
      </StatePersistenceProvider>
    </ErrorBoundary>
  );
}

try {
  bootstrap();
} catch (err) {
  captureError(normalizeError(err, "E4"));
}
