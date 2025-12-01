import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AppRuntime from "../AppRuntime/AppRuntime.jsx";
import AppIntegrationDemo from "./runtime/AppIntegrationDemo";

describe("Task 13 – Final Integration", () => {
  it("AppRuntime v1 final chạy đúng toàn bộ pipeline của 13 modules", async () => {
    Object.defineProperty(window.navigator, "onLine", {
      value: true,
      configurable: true,
    });
    render(
      <AppRuntime
        options={{
          lazyLoad: true,
          preload: true,
        }}
      >
        <AppIntegrationDemo />
      </AppRuntime>
    );

    // fallback phải xuất hiện trong lazy-load phase
    expect(screen.getByTestId("fallback")).toBeInTheDocument();

    // sau khi lazy module mount → fallback biến mất → app hiển thị
    await waitFor(() => expect(screen.queryByTestId("fallback")).toBeNull());

    const demo = await screen.findByTestId("integration-demo");
    expect(demo).toBeInTheDocument();

    expect(screen.getByTestId("network-status").textContent).toContain(
      "online"
    );
    expect(
      screen.getByTestId("device-type").textContent.length
    ).toBeGreaterThan(0);
    expect(screen.getByTestId("theme").textContent.length).toBeGreaterThan(0);
    expect(screen.getByTestId("lang").textContent.length).toBeGreaterThan(0);

    expect(screen.getByTestId("ui-ready").textContent).toContain("Ready");
    expect(screen.getByTestId("api-ready").textContent.length).toBeGreaterThan(
      0
    );

    expect(screen.getByTestId("cache-size").textContent).toContain("0");
    expect(screen.getByTestId("data-items").textContent).toContain("0");

    expect(screen.getByTestId("notify-count").textContent).toContain("0");
    expect(screen.getByTestId("storage-ready").textContent).toContain("Ready");
  });
});
