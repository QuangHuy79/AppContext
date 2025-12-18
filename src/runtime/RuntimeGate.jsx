// src/runtime/RuntimeGate.jsx
import React from "react";
import { useRuntimeReady } from "./useRuntimeReady";

export default function RuntimeGate({ children }) {
  const ready = useRuntimeReady(["api", "auth", "data", "sync"]);

  return (
    <>
      {/* ✅ ALWAYS render children – KHÔNG ĐƯỢC BLOCK */}
      {children}

      {/* ✅ Overlay loading – không phá lifecycle */}
      {!ready && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            pointerEvents: "none",
          }}
          data-testid="runtime-loading"
        >
          Initializing runtime…
        </div>
      )}
    </>
  );
}
