import React from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "../context/AppContext";
import { useAPI } from "../context/APIContext/APIContext";

const DebugAPI = () => {
  let apiHook;
  try {
    apiHook = useAPI();
  } catch (err) {
    console.error("[DebugAPI] ❌ useAPI() hook error:", err);
  }

  console.log("[DebugAPI] useAPI =", apiHook);
  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>Debug APIContext</h2>
      <pre>{JSON.stringify(apiHook, null, 2)}</pre>
    </div>
  );
};

// Mount component
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <AppProvider>
    <DebugAPI />
  </AppProvider>
);
