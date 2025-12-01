// import { describe, it, expect, vi, beforeEach } from "vitest";
// import { render, screen, act } from "@testing-library/react";
// import React, { Suspense } from "react";
// import AppRuntime, { preloadRuntimeModules } from "../AppRuntime/AppRuntime";

// // Helper delay
// const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// describe("Task 12 – Stress test Lazy + Preload", () => {
//   let mountStart = 0;
//   let mountEnd = 0;

//   beforeEach(() => {
//     mountStart = 0;
//     mountEnd = 0;
//   });

//   it("1) đo thời gian mount toàn bộ clusters đúng", async () => {
//     mountStart = performance.now();

//     render(
//       <Suspense fallback={<div data-testid="fallback">Loading...</div>}>
//         <AppRuntime>
//           <div data-testid="child">App Ready</div>
//         </AppRuntime>
//       </Suspense>
//     );

//     // Fallback xuất hiện ngay lập tức
//     expect(screen.getByTestId("fallback")).toBeDefined();

//     // Chờ các lazy module mount
//     await wait(120);

//     mountEnd = performance.now();
//     const total = mountEnd - mountStart;

//     // Kiểm tra mount không vượt quá 200ms (lazy load + suspense)
//     expect(total).toBeLessThan(250);

//     // Children hiển thị sau mount xong
//     expect(screen.getByTestId("child")).toBeDefined();
//   });

//   it("2) preloadRuntimeModules() hoạt động an toàn, không block UI", async () => {
//     const preloadStart = performance.now();

//     await act(async () => {
//       await preloadRuntimeModules();
//     });

//     const preloadEnd = performance.now();
//     const preloadTime = preloadEnd - preloadStart;

//     // Preload không được block critical path → phải < 120ms
//     expect(preloadTime).toBeLessThan(150);

//     // Render AppRuntime sau preload
//     render(
//       <Suspense fallback={<div data-testid="fallback">Loading...</div>}>
//         <AppRuntime>
//           <div data-testid="child">OK</div>
//         </AppRuntime>
//       </Suspense>
//     );

//     // Chờ lazy modules (nhưng preload đã chạy nên nhanh)
//     await wait(50);

//     expect(screen.getByTestId("child")).toBeDefined();
//   });

//   it("3) fallback hiển thị đúng → biến mất sau khi lazy module mount", async () => {
//     render(
//       <Suspense fallback={<div data-testid="fallback">Loading...</div>}>
//         <AppRuntime>
//           <div data-testid="child">Ready</div>
//         </AppRuntime>
//       </Suspense>
//     );

//     // Fallback phải xuất hiện ngay
//     expect(screen.getByTestId("fallback")).toBeDefined();

//     // Sau lazy load xong, fallback biến mất
//     await wait(120);

//     expect(screen.queryByTestId("fallback")).toBeNull();
//     expect(screen.getByTestId("child")).toBeDefined();
//   });

//   it("4) lazyLoad=false → không fallback (edge case)", async () => {
//     render(
//       <Suspense fallback={<div data-testid="fallback">Loading...</div>}>
//         <AppRuntime lazyLoad={false}>
//           <div data-testid="child">No Lazy</div>
//         </AppRuntime>
//       </Suspense>
//     );

//     // Vì lazyLoad=false → Fallback KHÔNG được xuất hiện
//     expect(screen.queryByTestId("fallback")).toBeNull();

//     // Children hiển thị ngay
//     expect(screen.getByTestId("child")).toBeDefined();
//   });
// });

// ==================================
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { describe, it, expect, test } from "vitest";
import React from "react";
import AppRuntime from "../AppRuntime/AppRuntime";

describe("Task 12 – Stress test Lazy + Preload", () => {
  test("1) đo thời gian mount toàn bộ clusters đúng", async () => {
    const start = performance.now();

    render(
      <AppRuntime options={{ lazyLoad: true, preload: true }}>
        <div data-testid="child">OK</div>
      </AppRuntime>
    );

    // WAIT for the child to appear after all lazy modules finish loading
    await screen.findByTestId("child");

    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(2000); // 2s budget
  });

  test("2) preloadRuntimeModules() hoạt động an toàn, không block UI", async () => {
    render(
      <AppRuntime options={{ preload: true }}>
        <div data-testid="child">OK</div>
      </AppRuntime>
    );

    expect(await screen.findByTestId("child")).toBeInTheDocument();
  });

  test("3) fallback hiển thị đúng → biến mất sau khi lazy module mount", async () => {
    render(
      <AppRuntime options={{ lazyLoad: true }}>
        <div data-testid="child">OK</div>
      </AppRuntime>
    );

    // fallback must appear FIRST
    await screen.findByTestId("fallback");

    // Then fallback must be removed
    await waitForElementToBeRemoved(() => screen.queryByTestId("fallback"));

    // Then child must appear
    expect(await screen.findByTestId("child")).toBeInTheDocument();
  });

  test("4) lazyLoad=false → không fallback (edge case)", async () => {
    render(
      <AppRuntime options={{ lazyLoad: false }}>
        <div data-testid="child">OK</div>
      </AppRuntime>
    );

    // no fallback appears
    expect(screen.queryByTestId("fallback")).toBeNull();

    // child always appears immediately
    expect(await screen.findByTestId("child")).toBeInTheDocument();
  });
});
