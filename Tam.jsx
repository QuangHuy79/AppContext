// src/runtime/RuntimeBoundary.jsx
import React from "react";

export default class RuntimeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.group("🧱 RuntimeBoundary");
      console.error(error);
      console.log(info);
      console.groupEnd();
    }

    // 🔌 PROD: chỗ này sau gắn Sentry / Logger
  }

  render() {
    if (this.state.hasError) {
      if (import.meta.env.PROD) {
        return (
          <div style={{ padding: 32 }}>
            <h2>Something went wrong.</h2>
          </div>
        );
      }

      return (
        <div style={{ padding: 32 }}>
          <h2>⚠️ Runtime Error</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
