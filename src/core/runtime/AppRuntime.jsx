/**
 * 🔒 CORE RUNTIME FLOW
 * ---------------------------------
 * Guard → Snapshot → Runtime
 * Order is invariant
 */

// src/runtime/AppRuntime.jsx
import React from "react";

import AppRuntimeWrapper from "./AppRuntimeWrapper";
import RuntimeGate from "./RuntimeGate";
import { RuntimeBoundary } from "./RuntimeBoundary";

/**
 * AppRuntime – Public Runtime Entry (C-14)
 *
 * Vai trò:
 * - Facade duy nhất cho App
 * - KHÔNG chứa orchestration
 * - KHÔNG chứa provider
 * - KHÔNG lazy / preload
 *
 * Thứ tự cố định:
 * Boundary → Gate → Wrapper → App
 */
export default function AppRuntime({ children }) {
  return (
    <RuntimeBoundary>
      <RuntimeGate>
        <AppRuntimeWrapper>{children}</AppRuntimeWrapper>
      </RuntimeGate>
    </RuntimeBoundary>
  );
}
