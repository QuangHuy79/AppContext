// Sau thay đổi, cấu trúc thực tế là
// ErrorBoundary
//  └─ StatePersistenceProvider
//      └─ AppProvider
//          └─ AppShell
//              └─ App
//                  └─ Runtime layer...
// src/app/AppRoot.jsx
import React from "react";
import ErrorBoundary from "../obs/ErrorBoundary";

import { AppProvider } from "../context/AppContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

import { registerGlobalErrors } from "../obs/registerGlobalErrors";

import { validateEnv } from "../runtime/env.validate";
import { readFeatureFlags } from "../runtime/featureFlags";

import App from "../../App";
import AppShell from "./AppShell"; // 👈 thêm dòng này

export default function AppRoot() {
  const envResult = validateEnv(import.meta.env);

  if (!envResult.ok) {
    if (import.meta.env.DEV) {
      throw new Error(envResult.errors.join(" | "));
    } else {
      console.error("[ENV INVALID]", envResult.errors);
    }
  }

  readFeatureFlags(import.meta.env);
  registerGlobalErrors();

  return (
    <ErrorBoundary>
      <StatePersistenceProvider persistKey="app_v2_state" version={2}>
        <AppProvider>
          <AppShell>
            {" "}
            {/* 👈 wrap ở đây */}
            <App />
          </AppShell>
        </AppProvider>
      </StatePersistenceProvider>
    </ErrorBoundary>
  );
}
