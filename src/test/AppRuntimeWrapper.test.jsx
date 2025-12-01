// // src/test/AppRuntimeWrapper.test.jsx
// import React from "react";
// import { describe, it, expect, beforeEach, jest } from "vitest";
// import { render, screen, waitFor } from "@testing-library/react";
// // import userEvent from "@testing-library/user-event";
// import AppRuntimeWrapper from "../AppRuntime/AppRuntimeWrapper";

// const DummyChild = () => <div data-testid="child">Child</div>;

// describe("AppRuntimeWrapper", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });

//   it("renders children and Core/UI clusters even without lazy load", () => {
//     render(
//       <AppRuntimeWrapper options={{ lazyLoad: false }}>
//         <DummyChild />
//       </AppRuntimeWrapper>
//     );
//     expect(screen.getByTestId("child")).toBeInTheDocument();
//   });

//   it("shows fallback when lazyLoad is true and providers not ready", () => {
//     render(
//       <AppRuntimeWrapper options={{ lazyLoad: true }}>
//         <DummyChild />
//       </AppRuntimeWrapper>
//     );
//     expect(screen.getByTestId("fallback")).toBeInTheDocument();
//   });

//   it("mounts SecurityCluster when api/auth ready events emitted", async () => {
//     render(
//       <AppRuntimeWrapper options={{ lazyLoad: true }}>
//         <DummyChild />
//       </AppRuntimeWrapper>
//     );

//     window.dispatchEvent(
//       new CustomEvent("app:provider:ready", { detail: { provider: "api" } })
//     );
//     window.dispatchEvent(
//       new CustomEvent("app:provider:ready", { detail: { provider: "auth" } })
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId("child")).toBeInTheDocument();
//     });
//   });

//   it("preload option emits ready events automatically", async () => {
//     render(
//       <AppRuntimeWrapper options={{ lazyLoad: true, preload: true }}>
//         <DummyChild />
//       </AppRuntimeWrapper>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId("child")).toBeInTheDocument();
//     });
//   });

//   it("uses custom suspenseFallback if provided", () => {
//     const fallback = <div data-testid="custom-fallback">Loading custom…</div>;
//     render(
//       <AppRuntimeWrapper
//         options={{ lazyLoad: true, suspenseFallback: fallback }}
//       >
//         <DummyChild />
//       </AppRuntimeWrapper>
//     );
//     expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
//   });
// });

// // =========================
// // src/test/AppRuntimeWrapper.test.jsx
// import { describe, it, expect, beforeEach, test, afterEach } from "vitest";
// import React, { Suspense } from "react";
// import { render, screen, waitFor, act } from "@testing-library/react";
// import AppRuntimeWrapper from "../AppRuntime/AppRuntimeWrapper.jsx";
// import "@testing-library/jest-dom";
// import { vi } from "vitest";

// // Dummy child component
// const DummyChild = () => <div data-testid="dummy-child">Hello World</div>;

// // --- Mock all lazy providers synchronously ---
// vi.mock("../context/APIContext/APIContext", () => {
//   return { APIProvider: ({ children }) => <>{children}</> };
// });

// vi.mock("../context/AuthContext/AuthContext", () => {
//   return { AuthProvider: ({ children }) => <>{children}</> };
// });

// vi.mock("../context/modules/DataContext", () => {
//   return { DataProvider: ({ children }) => <>{children}</> };
// });

// vi.mock("../context/modules/DataSyncContext", () => {
//   return { DataSyncProvider: ({ children }) => <>{children}</> };
// });

// vi.mock("../context/modules/NotificationContext", () => {
//   return { NotificationProvider: ({ children }) => <>{children}</> };
// });

// describe("AppRuntimeWrapper", () => {
//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   test("renders children and Core/UI clusters even without lazy load", async () => {
//     await act(async () => {
//       render(
//         <AppRuntimeWrapper options={{ lazyLoad: false }}>
//           <DummyChild />
//         </AppRuntimeWrapper>
//       );
//     });

//     expect(screen.getByTestId("dummy-child")).toBeInTheDocument();
//   });

//   test("shows fallback when lazyLoad is true and providers not ready", async () => {
//     await act(async () => {
//       render(
//         <AppRuntimeWrapper options={{ lazyLoad: true }}>
//           <DummyChild />
//         </AppRuntimeWrapper>
//       );
//     });

//     // fallback should appear first
//     expect(screen.getByTestId("fallback")).toBeInTheDocument();

//     // children should eventually render
//     await waitFor(() => {
//       expect(screen.getByTestId("dummy-child")).toBeInTheDocument();
//     });
//   });

//   test("mounts SecurityCluster when api/auth ready events emitted", async () => {
//     await act(async () => {
//       render(
//         <AppRuntimeWrapper options={{ lazyLoad: true }}>
//           <DummyChild />
//         </AppRuntimeWrapper>
//       );
//     });

//     // emit readiness events manually
//     act(() => {
//       window.dispatchEvent(
//         new CustomEvent("app:provider:ready", { detail: { provider: "api" } })
//       );
//       window.dispatchEvent(
//         new CustomEvent("app:provider:ready", { detail: { provider: "auth" } })
//       );
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("dummy-child")).toBeInTheDocument();
//     });
//   });

//   test("preload option emits ready events automatically", async () => {
//     await act(async () => {
//       render(
//         <AppRuntimeWrapper options={{ lazyLoad: true, preload: true }}>
//           <DummyChild />
//         </AppRuntimeWrapper>
//       );
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("dummy-child")).toBeInTheDocument();
//     });
//   });

//   test("uses custom suspenseFallback if provided", async () => {
//     const CustomFallback = () => (
//       <div data-testid="custom-fallback">Loading...</div>
//     );

//     await act(async () => {
//       render(
//         <AppRuntimeWrapper
//           options={{ lazyLoad: true, suspenseFallback: <CustomFallback /> }}
//         >
//           <DummyChild />
//         </AppRuntimeWrapper>
//       );
//     });

//     // fallback should appear first
//     expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();

//     await waitFor(() => {
//       expect(screen.getByTestId("dummy-child")).toBeInTheDocument();
//     });
//   });
// });

// ===================================
// src/test/AppRuntimeWrapper.test.jsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

import AppRuntimeWrapper from "../AppRuntime/AppRuntimeWrapper";

// Mock ALL lazy imports to avoid real module loading
vi.mock("../context/AuthContext/AuthContext", () => ({
  AuthProvider: ({ children }) => <div data-testid="auth">{children}</div>,
}));
vi.mock("../context/APIContext/APIContext", () => ({
  APIProvider: ({ children }) => <div data-testid="api">{children}</div>,
}));
vi.mock("../context/modules/DataContext", () => ({
  DataProvider: ({ children }) => <div data-testid="data">{children}</div>,
}));
vi.mock("../context/modules/DataSyncContext", () => ({
  DataSyncProvider: ({ children }) => (
    <div data-testid="datasync">{children}</div>
  ),
}));
vi.mock("../context/modules/NotificationContext", () => ({
  NotificationProvider: ({ children }) => (
    <div data-testid="notify">{children}</div>
  ),
}));

// Core/UI mocks (always rendered)
vi.mock("../context/modules/NetworkContext", () => ({
  NetworkProvider: ({ children }) => (
    <div data-testid="network">{children}</div>
  ),
}));
vi.mock("../context/modules/DeviceContext", () => ({
  DeviceProvider: ({ children }) => <div data-testid="device">{children}</div>,
}));
vi.mock("../context/modules/SettingsContext", () => ({
  SettingsProvider: ({ children }) => (
    <div data-testid="settings">{children}</div>
  ),
}));
vi.mock("../context/modules/UIContext", () => ({
  UIProvider: ({ children }) => <div data-testid="ui">{children}</div>,
}));
vi.mock("../context/modules/StorageContext", () => ({
  StorageProvider: ({ children }) => (
    <div data-testid="storage">{children}</div>
  ),
}));
vi.mock("../context/modules/CacheContext", () => ({
  CacheProvider: ({ children }) => <div data-testid="cache">{children}</div>,
}));
vi.mock("../context/StatePersistenceContext", () => ({
  StatePersistenceProvider: ({ children }) => (
    <div data-testid="state">{children}</div>
  ),
}));

beforeEach(() => {
  vi.useFakeTimers();
});

// Helper emit event
function emitReady(name) {
  window.dispatchEvent(
    new CustomEvent("app:provider:ready", {
      detail: { provider: name },
    })
  );
}

describe("AppRuntimeWrapper", () => {
  it("renders Core/UI clusters immediately even without lazy load", () => {
    render(
      <AppRuntimeWrapper options={{ lazyLoad: false }}>
        <div data-testid="child" />
      </AppRuntimeWrapper>
    );

    expect(screen.getByTestId("network")).toBeDefined();
    expect(screen.getByTestId("device")).toBeDefined();
    expect(screen.getByTestId("ui")).toBeDefined();
    expect(screen.getByTestId("child")).toBeDefined();

    // lazy clusters load synchronously → must exist
    expect(screen.getByTestId("auth")).toBeDefined();
    expect(screen.getByTestId("api")).toBeDefined();
    expect(screen.getByTestId("data")).toBeDefined();
    expect(screen.getByTestId("datasync")).toBeDefined();
  });

  it("shows fallback when lazyLoad=true and lazy clusters not ready", () => {
    render(
      <AppRuntimeWrapper options={{ lazyLoad: true }}>
        <div data-testid="child" />
      </AppRuntimeWrapper>
    );

    // Core/ui appear
    expect(screen.getByTestId("network")).toBeDefined();
    expect(screen.getByTestId("ui")).toBeDefined();

    // lazy cluster should show fallback
    expect(screen.getByTestId("fallback")).toBeDefined();
  });

  it("mounts SecurityCluster after api/auth ready events", async () => {
    render(
      <AppRuntimeWrapper options={{ lazyLoad: true }}>
        <div data-testid="child" />
      </AppRuntimeWrapper>
    );

    // initial fallback
    expect(screen.getByTestId("fallback")).toBeDefined();

    // trigger readiness
    act(() => {
      emitReady("api");
      emitReady("auth");
    });

    await act(async () => {
      vi.runAllTimers();
    });

    // SecurityCluster visible
    expect(screen.getByTestId("api")).toBeDefined();
    expect(screen.getByTestId("auth")).toBeDefined();
  });

  it("preload=true auto emits ready events", async () => {
    render(
      <AppRuntimeWrapper options={{ lazyLoad: true, preload: true }}>
        <div data-testid="child" />
      </AppRuntimeWrapper>
    );

    // preload emits events → after timer, lazy cluster mounts
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByTestId("api")).toBeDefined();
    expect(screen.getByTestId("auth")).toBeDefined();
    expect(screen.getByTestId("data")).toBeDefined();
  });

  it("uses custom suspenseFallback when provided", () => {
    render(
      <AppRuntimeWrapper
        options={{ lazyLoad: true, suspenseFallback: <div data-testid="X" /> }}
      >
        <div data-testid="child" />
      </AppRuntimeWrapper>
    );

    expect(screen.getByTestId("X")).toBeDefined();
  });
});
