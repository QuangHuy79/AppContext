// Phiên bản sạch – chuẩn Phase 3.7
// src/App.jsx
import { useEffect } from "react";
import AppRuntimeClient from "./runtime/AppRuntimeClient";
import { emitEvent } from "./obs/eventStream";

export default function App() {
  // App mount signal (OBS only, no state side-effect)
  useEffect(() => {
    emitEvent("app:mount");
  }, []);

  return (
    <AppRuntimeClient>
      <div>APP RENDER OK</div>
    </AppRuntimeClient>
  );
}
