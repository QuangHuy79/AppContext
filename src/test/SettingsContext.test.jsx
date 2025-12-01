// src/test/SettingsContext.test.jsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  SettingsProvider,
  useSettings,
} from "../context/modules/SettingsContext";

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("data-theme", "light");
});

// Component test helper
const ShowSettings = () => {
  const { state } = useSettings();
  return (
    <div data-testid="settings">
      {state.theme}-{state.language}
    </div>
  );
};

// Wrapper
const Wrapper = ({ children }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

describe("SettingsContext", () => {
  it("khởi tạo mặc định: theme=light, language=en", () => {
    render(<ShowSettings />, { wrapper: Wrapper });
    expect(screen.getByTestId("settings").textContent).toBe("light-en");
  });

  it("load settings từ localStorage khi khởi động", () => {
    localStorage.setItem(
      "app_settings",
      JSON.stringify({
        theme: "dark",
        language: "vi",
      })
    );

    render(<ShowSettings />, { wrapper: Wrapper });

    expect(screen.getByTestId("settings").textContent).toBe("dark-vi");
  });

  it("setTheme cập nhật theme + lưu vào localStorage + áp vào document", () => {
    const TestComponent = () => {
      const { setTheme } = useSettings();
      return (
        <button onClick={() => setTheme("dark")} data-testid="btn">
          Set Dark
        </button>
      );
    };

    render(
      <>
        <ShowSettings />
        <TestComponent />
      </>,
      { wrapper: Wrapper }
    );

    act(() => screen.getByTestId("btn").click());

    expect(screen.getByTestId("settings").textContent).toBe("dark-en");

    expect(JSON.parse(localStorage.getItem("app_settings")).theme).toBe("dark");

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("setLanguage cập nhật language + lưu vào localStorage", () => {
    const TestComponent = () => {
      const { setLanguage } = useSettings();
      return (
        <button onClick={() => setLanguage("vi")} data-testid="btn">
          Set VI
        </button>
      );
    };

    render(
      <>
        <ShowSettings />
        <TestComponent />
      </>,
      { wrapper: Wrapper }
    );

    act(() => screen.getByTestId("btn").click());

    expect(screen.getByTestId("settings").textContent).toBe("light-vi");
    expect(JSON.parse(localStorage.getItem("app_settings")).language).toBe(
      "vi"
    );
  });

  it("toggleTheme hoạt động đúng", () => {
    const TestComponent = () => {
      const { toggleTheme } = useSettings();
      return (
        <button onClick={() => toggleTheme()} data-testid="btn">
          Toggle
        </button>
      );
    };

    render(
      <>
        <ShowSettings />
        <TestComponent />
      </>,
      { wrapper: Wrapper }
    );

    // Light → Dark
    act(() => screen.getByTestId("btn").click());
    expect(screen.getByTestId("settings").textContent).toBe("dark-en");

    // Dark → Light
    act(() => screen.getByTestId("btn").click());
    expect(screen.getByTestId("settings").textContent).toBe("light-en");
  });
});
