// src/runtime/AppRuntimeClient.jsx
import React, { useEffect } from "react";

import { AppProvider } from "../context/AppContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

import RuntimeOrchestrator from "./RuntimeOrchestrator";
import RuntimeDevGuard from "./RuntimeDevGuard";
// Error boundary
class RuntimeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32 }}>
          <h2>⚠️ Runtime Error</h2>
          <pre style={{ marginTop: 16 }}>
            {this.state.error?.toString() || "Unknown error"}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppRuntimeClient = ({ children }) => {
  useEffect(() => {
    console.log(
      "%c[AppRuntimeClient] Mounted",
      "color:#4CAF50;font-weight:bold"
    );
    console.log("[C-17.1] AppRuntimeClient mounted once"); // ✅ thêm dòng này
    // ✅ C-26: DEV GUARD (DEV only, không ảnh hưởng prod)
    if (import.meta.env.DEV) {
      console.log("[C-26] AppRuntimeClient mounted (dev check)");
    }
  }, []);

  return (
    <RuntimeErrorBoundary>
      <StatePersistenceProvider persistKey="APP_STATE" version={2}>
        {/* 🟢 ĐÚNG: AppProvider phải nằm TRƯỚC RuntimeOrchestrator */}
        <AppProvider>
          <RuntimeDevGuard>
            <RuntimeOrchestrator>{children}</RuntimeOrchestrator>
          </RuntimeDevGuard>
        </AppProvider>
      </StatePersistenceProvider>
    </RuntimeErrorBoundary>
  );
};

export default AppRuntimeClient;
