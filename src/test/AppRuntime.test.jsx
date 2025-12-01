// src/test/AppRuntime.test.jsx
import React, { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";
import AppRuntime, { preloadRuntimeModules } from "../AppRuntime/AppRuntime";

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
describe("AppRuntime Integration Test", () => {
  it("renders children and all clusters (lazyLoad false)", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AppRuntime options={{ lazyLoad: false }}>
          <div data-testid="Child">Hello World</div>
        </AppRuntime>
      </Suspense>
    );

    // Kiểm tra children
    const child = await screen.findByTestId("Child");
    expect(child).toBeInTheDocument();

    // Kiểm tra các cluster lazy đã mount (synchronously)
    expect(screen.getByTestId("Auth")).toBeInTheDocument();
    expect(screen.getByTestId("API")).toBeInTheDocument();
    expect(screen.getByTestId("Data")).toBeInTheDocument();
    expect(screen.getByTestId("DataSync")).toBeInTheDocument();
    expect(screen.getByTestId("Notification")).toBeInTheDocument();
  });

  it("preloadRuntimeModules runs without crashing", () => {
    expect(() => {
      preloadRuntimeModules([
        "Auth",
        "API",
        "Data",
        "DataSync",
        "Notification",
      ]);
    }).not.toThrow();
  });
});

// // =====================================
// // Đây là cách Task 10 integration test hoàn chỉnh trong 1 file duy nhất.
// // src/test/AppRuntime.test.jsx
// import React, { Suspense } from "react";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { describe, it, vi, expect } from "vitest";
// import AppRuntime, { preloadRuntimeModules } from "../AppRuntime/AppRuntime";

// // -------------------------
// // Mock lazy-loaded modules
// // -------------------------
// vi.mock("../context/AuthContext/AuthContext", async () => ({
//   AuthProvider: ({ children }) => <div data-testid="Auth">{children}</div>,
// }));

// vi.mock("../context/APIContext/APIContext", async () => ({
//   APIProvider: ({ children }) => <div data-testid="API">{children}</div>,
// }));

// vi.mock("../context/modules/DataContext", async () => ({
//   DataProvider: ({ children }) => <div data-testid="Data">{children}</div>,
// }));

// vi.mock("../context/modules/DataSyncContext", async () => ({
//   DataSyncProvider: ({ children }) => (
//     <div data-testid="DataSync">{children}</div>
//   ),
// }));

// vi.mock("../context/modules/NotificationContext", async () => ({
//   NotificationProvider: ({ children }) => (
//     <div data-testid="Notification">{children}</div>
//   ),
// }));

// // -------------------------
// // Tests
// // -------------------------
// describe("AppRuntime Integration Test", () => {
//   // -------------------------
//   // Test lazyLoad false (synchronous)
//   // -------------------------
//   it("renders children and all clusters (lazyLoad false)", async () => {
//     render(
//       <Suspense fallback={<div>Loading…</div>}>
//         <AppRuntime options={{ lazyLoad: false }}>
//           <div data-testid="Child">Hello World</div>
//         </AppRuntime>
//       </Suspense>
//     );

//     // Kiểm tra children
//     const child = await screen.findByTestId("Child");
//     expect(child).toBeInTheDocument();

//     // Kiểm tra các cluster lazy đã mount
//     expect(screen.getByTestId("Auth")).toBeInTheDocument();
//     expect(screen.getByTestId("API")).toBeInTheDocument();
//     expect(screen.getByTestId("Data")).toBeInTheDocument();
//     expect(screen.getByTestId("DataSync")).toBeInTheDocument();
//     expect(screen.getByTestId("Notification")).toBeInTheDocument();
//   });

//   // -------------------------
//   // Test lazyLoad true (production simulation)
//   // -------------------------
//   it("renders fallback during lazy load and children after (lazyLoad true)", async () => {
//     render(
//       <Suspense fallback={<div>Loading…</div>}>
//         <AppRuntime options={{ lazyLoad: true }}>
//           <div data-testid="Child">Hello Lazy World</div>
//         </AppRuntime>
//       </Suspense>
//     );

//     // Kiểm tra fallback hiển thị ngay khi render
//     expect(screen.getByText("Loading…")).toBeInTheDocument();

//     // Kiểm tra children render sau lazy module load
//     const child = await screen.findByTestId("Child");
//     expect(child).toBeInTheDocument();

//     // Kiểm tra các cluster lazy đã mount
//     expect(screen.getByTestId("Auth")).toBeInTheDocument();
//     expect(screen.getByTestId("API")).toBeInTheDocument();
//     expect(screen.getByTestId("Data")).toBeInTheDocument();
//     expect(screen.getByTestId("DataSync")).toBeInTheDocument();
//     expect(screen.getByTestId("Notification")).toBeInTheDocument();
//   });

//   // -------------------------
//   // Test preloadRuntimeModules
//   // -------------------------
//   it("preloadRuntimeModules runs without crashing", () => {
//     expect(() => {
//       preloadRuntimeModules([
//         "Auth",
//         "API",
//         "Data",
//         "DataSync",
//         "Notification",
//       ]);
//     }).not.toThrow();
//   });
// });
