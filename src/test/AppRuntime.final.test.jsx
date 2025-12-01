// src/test/AppRuntime.final.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppRuntime from "../AppRuntime/AppRuntime";

// ----------
// Mocks: synchronous providers that emit readiness on mount
// ----------

vi.mock("../context/AuthContext/AuthContext", () => {
  const React = require("react");
  return {
    AuthProvider: ({ children }) => {
      React.useEffect(() => {
        window.dispatchEvent(
          new CustomEvent("app:provider:ready", {
            detail: { provider: "auth" },
          })
        );
      }, []);
      return <>{children}</>;
    },
  };
});

vi.mock("../context/APIContext/APIContext", () => {
  const React = require("react");
  return {
    APIProvider: ({ children }) => {
      React.useEffect(() => {
        window.dispatchEvent(
          new CustomEvent("app:provider:ready", { detail: { provider: "api" } })
        );
      }, []);
      return <>{children}</>;
    },
  };
});

vi.mock("../context/modules/DataContext", () => {
  const React = require("react");
  return {
    DataProvider: ({ children }) => {
      React.useEffect(() => {
        window.dispatchEvent(
          new CustomEvent("app:provider:ready", {
            detail: { provider: "data" },
          })
        );
      }, []);
      return <>{children}</>;
    },
  };
});

vi.mock("../context/modules/DataSyncContext", () => {
  const React = require("react");
  return {
    DataSyncProvider: ({ children }) => {
      React.useEffect(() => {
        window.dispatchEvent(
          new CustomEvent("app:provider:ready", {
            detail: { provider: "datasync" },
          })
        );
      }, []);
      return <>{children}</>;
    },
  };
});

vi.mock("../context/modules/NotificationContext", () => {
  const React = require("react");
  return {
    NotificationProvider: ({ children }) => {
      React.useEffect(() => {
        window.dispatchEvent(
          new CustomEvent("app:provider:ready", {
            detail: { provider: "notification" },
          })
        );
      }, []);
      return <>{children}</>;
    },
  };
});

// ----------
// Helper components
// ----------
const Child = () => <div data-testid="child">Child Component</div>;

// For the placeholder test we need a variant that DOES NOT emit readiness.
// We'll create a dynamic mock for that test by restoring modules first.
// (We'll use vi.unmock inside that test.)
// ----------

describe("AppRuntime v2 – pipeline orchestration (with provider mocks)", () => {
  it("renders children when lazyLoad=false (providers emit ready on mount)", async () => {
    render(
      <AppRuntime options={{ lazyLoad: false }}>
        <Child />
      </AppRuntime>
    );

    // Since mocks emit ready in mount, the pipeline unlocks and child appears.
    const child = await screen.findByTestId("child");
    expect(child).toBeInTheDocument();
  });

  it("renders children when lazyLoad=true (providers lazy but mocked to emit ready)", async () => {
    render(
      <AppRuntime options={{ lazyLoad: true }}>
        <Child />
      </AppRuntime>
    );

    // Because mocks dispatch ready on mount, child should appear eventually.
    const child = await screen.findByTestId("child");
    expect(child).toBeInTheDocument();
  });

  it("preload option unlocks pipeline and renders children", async () => {
    render(
      <AppRuntime options={{ lazyLoad: true, preload: true }}>
        <Child />
      </AppRuntime>
    );

    // With mocks that emit on mount, preload path will also settle and child appears
    const child = await screen.findByTestId("child");
    expect(child).toBeInTheDocument();
  });

  it("shows runtime-waiting-security placeholder if providers do NOT emit ready", async () => {
    // Remove mocks so providers won't auto-emit
    vi.unmock("../context/AuthContext/AuthContext");
    vi.unmock("../context/APIContext/APIContext");
    vi.unmock("../context/modules/DataContext");
    vi.unmock("../context/modules/DataSyncContext");
    vi.unmock("../context/modules/NotificationContext");

    // Re-import AppRuntime fresh (so it uses the real lazy providers)
    // Note: Node module cache retains the previous import of AppRuntime; to ensure
    // AppRuntime picks up unmocks you'd need to clear require cache and re-import.
    // Simpler approach: import a fresh instance via dynamic import.
    // We'll dynamically import AppRuntime module fresh here.
    const { default: FreshAppRuntime } = await import(
      "../AppRuntime/AppRuntime"
    );

    render(
      <FreshAppRuntime options={{ lazyLoad: true }}>
        <Child />
      </FreshAppRuntime>
    );

    // Now since real lazy providers won't be ready immediately, AppRuntime should render the waiting placeholder
    const placeholder = await screen.findByTestId("runtime-waiting-security");
    expect(placeholder).toBeInTheDocument();

    // cleanup: re-mock modules to keep other tests stable (optional)
    // (We will not re-mock here; subsequent test runs should isolate processes)
  });
});
