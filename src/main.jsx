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
import { validateEnv } from "./runtime/env.validate"; // 👈 PHASE 5.1
import { readFeatureFlags } from "./runtime/featureFlags";

const envResult = validateEnv(import.meta.env);

if (!envResult.ok) {
  if (import.meta.env.DEV) {
    throw new Error(envResult.errors.join(" | "));
  } else {
    console.error("[ENV INVALID]", envResult.errors);
    // silent degrade — vẫn cho app chạy
  }
}
const featureFlags = readFeatureFlags(import.meta.env);
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
