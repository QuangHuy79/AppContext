// src/test/debug.AppRuntime.dom.test.jsx
import React from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";

// --- Minimal safe mocks (non-lazy) so AppRuntime mounts quickly ---
// these MUST match the import paths used in AppRuntime
vi.mock("../context/APIContext/APIContext", () => ({
  APIProvider: ({ children }) => <div data-testid="api-mock">{children}</div>,
  APIContext: { Provider: ({ children }) => <>{children}</> },
}));
vi.mock("../context/AuthContext/AuthContext", () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-mock">{children}</div>,
  AuthContext: { Provider: ({ children }) => <>{children}</> },
  useAuth: () => ({ user: null, isAuthenticated: false, initialized: true }),
}));
vi.mock("../context/modules/DataContext", () => ({
  DataProvider: ({ children }) => <div data-testid="data-mock">{children}</div>,
}));
vi.mock("../context/modules/DataSyncContext", () => ({
  DataSyncProvider: ({ children }) => (
    <div data-testid="datasync-mock">{children}</div>
  ),
}));
vi.mock("../context/modules/NotificationContext", () => ({
  NotificationProvider: ({ children }) => (
    <div data-testid="notification-mock">{children}</div>
  ),
}));
vi.mock("../services/toastService", () => ({ default: { show: vi.fn() } }));
vi.mock("../services/tokenService", () => ({
  tokenService: {
    getAccessToken: () => null,
    getRefreshToken: () => null,
    setTokens: () => {},
    clearTokens: () => {},
  },
}));

// Import AppRuntime AFTER mocks
import AppRuntime from "../AppRuntime/AppRuntime.jsx";

test("debug render and print DOM", async () => {
  const { container } = render(
    <AppRuntime options={{ lazyLoad: false }}>
      <div data-testid="child">DEBUG CHILD</div>
    </AppRuntime>
  );
  // print minimal info
  // eslint-disable-next-line no-console
  console.log("BODY HTML:", document.body.innerHTML.slice(0, 5000));
});
