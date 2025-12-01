// src/test/DataContext.test.jsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";

// ========================== MOCKS ==============================

// Mock AppContext (mockDispatch để kiểm tra dispatch calls)
const mockDispatch = vi.fn();
vi.mock("../context/AppContext", () => ({
  useAppContext: () => ({ state: { data: {} } }),
  useAppDispatch: () => mockDispatch,
}));

// Mock AuthContext (trả user có giá trị để DataContext auto-load có thể chạy)
vi.mock("../context/AuthContext/useAuth", () => ({
  useAuth: () => ({ user: { id: 1, name: "John" } }),
}));

// Mock dataService (factory inline — không dùng biến top-level bên ngoài)
vi.mock("../services/dataService", () => ({
  dataService: {
    fetchAll: vi.fn(() =>
      Promise.resolve({
        profile: { name: "John Doe", email: "john@example.com" },
        settings: { theme: "dark", language: "en" },
      })
    ),
    save: vi.fn(() => Promise.resolve(true)),
    clear: vi.fn(() => Promise.resolve()),
  },
}));

// import mocked dataService (this is the mocked instance)
import { dataService } from "../services/dataService";

// import module under test (after mocks)
import { DataProvider, useData } from "../context/modules/DataContext";

// clear mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// =============================== TESTS =====================================

describe("DataContext", () => {
  test("loadData triggers fetchAll (call count increases) and dispatches DATA + toast", async () => {
    // Render a small TestComp which exposes loadData
    const TestComp = () => {
      const { loadData } = useData();
      return <button onClick={loadData}>load</button>;
    };

    render(
      <DataProvider>
        <TestComp />
      </DataProvider>
    );

    // record initial calls (auto-load from useEffect may have already called fetchAll)
    const initialCalls = dataService.fetchAll.mock.calls.length;

    // trigger loadData (this must cause additional fetchAll call)
    await act(async () => {
      screen.getByText("load").click();
      // wait microtask to let async handler run
      await Promise.resolve();
    });

    // Expect that fetchAll was called at least once more (robust against auto-load)
    expect(dataService.fetchAll.mock.calls.length).toBeGreaterThan(
      initialCalls
    );

    // Expect that dispatch received DATA/SET_ALL at least once
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "DATA/SET_ALL" })
    );

    // Expect a UI toast dispatch happened
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "UI/SHOW_TOAST" })
    );
  });

  test("updateData calls save and dispatch", async () => {
    const TestComp = () => {
      const { updateData } = useData();
      return <button onClick={() => updateData("key1", 123)}>update</button>;
    };

    render(
      <DataProvider>
        <TestComp />
      </DataProvider>
    );

    await act(async () => {
      screen.getByText("update").click();
      // allow async to proceed
      await Promise.resolve();
    });

    expect(dataService.save).toHaveBeenCalledWith("key1", 123);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "DATA/UPDATE",
      payload: { key: "key1", value: 123 },
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "UI/SHOW_TOAST" })
    );
  });

  test("resetData calls clear and dispatch", async () => {
    const TestComp = () => {
      const { resetData } = useData();
      return <button onClick={resetData}>reset</button>;
    };

    render(
      <DataProvider>
        <TestComp />
      </DataProvider>
    );

    await act(async () => {
      screen.getByText("reset").click();
      await Promise.resolve();
    });

    expect(dataService.clear).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenCalledWith({ type: "DATA/RESET" });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "UI/SHOW_TOAST" })
    );
  });
});
