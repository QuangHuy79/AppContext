// import { describe, it, expect, beforeEach } from "vitest";
// import React from "react";
// import { render, screen } from "@testing-library/react";
// import {
//   UIProvider,
//   useUIContext,
//   initialUIState,
//   uiReducer,
// } from "../context/modules/UIContext";

// // ---------------------------------------------------
// // Helper component để kiểm tra UIContext
// // ---------------------------------------------------
// function TestUI() {
//   const { state, dispatch } = useUIContext();

//   return (
//     <div>
//       <div data-testid="sidebar">{state.sidebarOpen ? "open" : "closed"}</div>
//       <div data-testid="loading">{state.loading ? "loading" : "idle"}</div>
//       <div data-testid="toast">{state.toast || ""}</div>

//       <button
//         data-testid="toggleSidebar"
//         onClick={() => dispatch({ type: "UI/TOGGLE_SIDEBAR" })}
//       />

//       <button
//         data-testid="setSidebarTrue"
//         onClick={() => dispatch({ type: "UI/SET_SIDEBAR", payload: true })}
//       />

//       <button
//         data-testid="setLoading"
//         onClick={() => dispatch({ type: "UI/SET_LOADING", payload: true })}
//       />

//       <button
//         data-testid="showToast"
//         onClick={() => dispatch({ type: "UI/SHOW_TOAST", payload: "Hello UI" })}
//       />

//       <button
//         data-testid="clearToast"
//         onClick={() => dispatch({ type: "UI/CLEAR_TOAST" })}
//       />
//     </div>
//   );
// }

// // ---------------------------------------------------
// // ❌ Component lỗi: dùng hook ngoài provider
// // ---------------------------------------------------
// function BrokenComponent() {
//   useUIContext(); // phải throw lỗi
//   return null;
// }

// // ---------------------------------------------------
// // TESTS
// // ---------------------------------------------------

// describe("UIContext", () => {
//   beforeEach(() => {
//     // reset DOM trước mỗi test
//     document.body.innerHTML = "";
//   });

//   it("khởi tạo state mặc định đúng", () => {
//     const { sidebarOpen, loading, toast } = initialUIState;

//     expect(sidebarOpen).toBe(false);
//     expect(loading).toBe(false);
//     expect(toast).toBe(null);
//   });

//   it("toggle sidebar hoạt động đúng", () => {
//     render(
//       <UIProvider>
//         <TestUI />
//       </UIProvider>
//     );

//     // ban đầu closed
//     expect(screen.getByTestId("sidebar").textContent).toBe("closed");

//     // click → open
//     screen.getByTestId("toggleSidebar").click();
//     expect(screen.getByTestId("sidebar").textContent).toBe("open");

//     // click → closed
//     screen.getByTestId("toggleSidebar").click();
//     expect(screen.getByTestId("sidebar").textContent).toBe("closed");
//   });

//   it("SET_SIDEBAR cập nhật đúng", () => {
//     render(
//       <UIProvider>
//         <TestUI />
//       </UIProvider>
//     );

//     screen.getByTestId("setSidebarTrue").click();
//     expect(screen.getByTestId("sidebar").textContent).toBe("open");
//   });

//   it("SET_LOADING cập nhật đúng", () => {
//     render(
//       <UIProvider>
//         <TestUI />
//       </UIProvider>
//     );

//     screen.getByTestId("setLoading").click();
//     expect(screen.getByTestId("loading").textContent).toBe("loading");
//   });

//   it("SHOW_TOAST và CLEAR_TOAST hoạt động đúng", () => {
//     render(
//       <UIProvider>
//         <TestUI />
//       </UIProvider>
//     );

//     // show toast
//     screen.getByTestId("showToast").click();
//     expect(screen.getByTestId("toast").textContent).toBe("Hello UI");

//     // clear toast
//     screen.getByTestId("clearToast").click();
//     expect(screen.getByTestId("toast").textContent).toBe("");
//   });

//   it("báo lỗi khi dùng useUIContext ngoài Provider", () => {
//     expect(() => render(<BrokenComponent />)).toThrow(
//       "useUIContext must be used within UIProvider"
//     );
//   });
// });

// ==============================
// src/test/UIContext.test.jsx
import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import {
  UIProvider,
  useUIContext,
  initialUIState,
} from "../context/modules/UIContext";

// ---------------------------------------------------
// Helper component để kiểm tra UIContext
// ---------------------------------------------------
function TestUI() {
  const { state, dispatch } = useUIContext();

  return (
    <div>
      <div data-testid="sidebar">{state.sidebarOpen ? "open" : "closed"}</div>
      <div data-testid="loading">{state.loading ? "loading" : "idle"}</div>
      <div data-testid="toast">{state.toast || ""}</div>

      <button
        data-testid="toggleSidebar"
        onClick={() => dispatch({ type: "UI/TOGGLE_SIDEBAR" })}
      />

      <button
        data-testid="setSidebarTrue"
        onClick={() => dispatch({ type: "UI/SET_SIDEBAR", payload: true })}
      />

      <button
        data-testid="setLoading"
        onClick={() => dispatch({ type: "UI/SET_LOADING", payload: true })}
      />

      <button
        data-testid="showToast"
        onClick={() => dispatch({ type: "UI/SHOW_TOAST", payload: "Hello UI" })}
      />

      <button
        data-testid="clearToast"
        onClick={() => dispatch({ type: "UI/CLEAR_TOAST" })}
      />
    </div>
  );
}

// ---------------------------------------------------
// Component lỗi: dùng hook ngoài provider
// ---------------------------------------------------
function BrokenComponent() {
  useUIContext(); // phải throw lỗi
  return null;
}

// ---------------------------------------------------
// TESTS
// ---------------------------------------------------
describe("UIContext", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("khởi tạo state mặc định đúng", () => {
    const { sidebarOpen, loading, toast } = initialUIState;
    expect(sidebarOpen).toBe(false);
    expect(loading).toBe(false);
    expect(toast).toBe(null);
  });

  it("toggle sidebar hoạt động đúng", () => {
    render(
      <UIProvider>
        <TestUI />
      </UIProvider>
    );

    expect(screen.getByTestId("sidebar").textContent).toBe("closed");

    act(() => {
      screen.getByTestId("toggleSidebar").click();
    });
    expect(screen.getByTestId("sidebar").textContent).toBe("open");

    act(() => {
      screen.getByTestId("toggleSidebar").click();
    });
    expect(screen.getByTestId("sidebar").textContent).toBe("closed");
  });

  it("SET_SIDEBAR cập nhật đúng", () => {
    render(
      <UIProvider>
        <TestUI />
      </UIProvider>
    );

    act(() => {
      screen.getByTestId("setSidebarTrue").click();
    });
    expect(screen.getByTestId("sidebar").textContent).toBe("open");
  });

  it("SET_LOADING cập nhật đúng", () => {
    render(
      <UIProvider>
        <TestUI />
      </UIProvider>
    );

    act(() => {
      screen.getByTestId("setLoading").click();
    });
    expect(screen.getByTestId("loading").textContent).toBe("loading");
  });

  it("SHOW_TOAST và CLEAR_TOAST hoạt động đúng", () => {
    render(
      <UIProvider>
        <TestUI />
      </UIProvider>
    );

    act(() => {
      screen.getByTestId("showToast").click();
    });
    expect(screen.getByTestId("toast").textContent).toBe("Hello UI");

    act(() => {
      screen.getByTestId("clearToast").click();
    });
    expect(screen.getByTestId("toast").textContent).toBe("");
  });

  it("báo lỗi khi dùng useUIContext ngoài Provider", () => {
    expect(() => render(<BrokenComponent />)).toThrow(
      "useUIContext must be used within UIProvider"
    );
  });
});
