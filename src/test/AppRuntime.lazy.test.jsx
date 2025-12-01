// src/test/AppRuntime.lazy.test.jsx
import React, { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";
import AppRuntime from "../AppRuntime/AppRuntime";

// -------------------------
// Mock các lazy-loaded modules
// -------------------------
vi.mock("../context/AuthContext/AuthContext", async () => ({
  AuthProvider: ({ children }) => <div data-testid="Auth">{children}</div>,
}));

vi.mock("../context/APIContext/APIContext", async () => ({
  APIProvider: ({ children }) => <div data-testid="API">{children}</div>,
}));

vi.mock("../context/modules/DataContext", async () => ({
  DataProvider: ({ children }) => <div data-testid="Data">{children}</div>,
}));

vi.mock("../context/modules/DataSyncContext", async () => ({
  DataSyncProvider: ({ children }) => (
    <div data-testid="DataSync">{children}</div>
  ),
}));

vi.mock("../context/modules/NotificationContext", async () => ({
  NotificationProvider: ({ children }) => (
    <div data-testid="Notification">{children}</div>
  ),
}));

// -------------------------
// Tests
// -------------------------
describe("AppRuntime Integration Test (lazyLoad: true)", () => {
  it("renders fallback during lazy load and children after", async () => {
    render(
      <Suspense fallback={<div data-testid="Fallback">Loading…</div>}>
        <AppRuntime options={{ lazyLoad: true }}>
          <div data-testid="Child">Hello Lazy World</div>
        </AppRuntime>
      </Suspense>
    );

    // Kiểm tra fallback hiển thị ngay khi render
    expect(screen.getByTestId("Fallback")).toBeInTheDocument();

    // Kiểm tra children render sau lazy module load
    const child = await screen.findByTestId("Child");
    expect(child).toBeInTheDocument();

    // Kiểm tra các cluster lazy đã mount
    expect(screen.getByTestId("Auth")).toBeInTheDocument();
    expect(screen.getByTestId("API")).toBeInTheDocument();
    expect(screen.getByTestId("Data")).toBeInTheDocument();
    expect(screen.getByTestId("DataSync")).toBeInTheDocument();
    expect(screen.getByTestId("Notification")).toBeInTheDocument();
  });
});
