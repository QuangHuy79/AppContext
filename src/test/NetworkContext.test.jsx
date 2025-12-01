import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { NetworkProvider, useNetwork } from "../context/modules/NetworkContext";

// Component test
const TestComponent = () => {
  const { isOnline } = useNetwork();
  return <div data-testid="status">{isOnline ? "online" : "offline"}</div>;
};

describe("NetworkContext", () => {
  it("khởi tạo theo navigator.onLine (mặc định = true trong JSDOM)", () => {
    render(
      <NetworkProvider>
        <TestComponent />
      </NetworkProvider>
    );

    expect(screen.getByTestId("status").textContent).toBe("online");
  });

  it("cập nhật thành online khi bắn event 'online'", async () => {
    render(
      <NetworkProvider>
        <TestComponent />
      </NetworkProvider>
    );

    window.dispatchEvent(new Event("online"));

    await waitFor(() =>
      expect(screen.getByTestId("status").textContent).toBe("online")
    );
  });

  it("cập nhật thành offline khi bắn event 'offline'", async () => {
    render(
      <NetworkProvider>
        <TestComponent />
      </NetworkProvider>
    );

    window.dispatchEvent(new Event("offline"));

    await waitFor(() =>
      expect(screen.getByTestId("status").textContent).toBe("offline")
    );
  });
});
