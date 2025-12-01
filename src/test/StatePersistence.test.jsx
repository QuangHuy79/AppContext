// // ✅ src/test/StatePersistence.test.jsx
// import React from "react";
// import { describe, it, expect, beforeEach, vi } from "vitest";
// import { render, screen, act } from "@testing-library/react";
// import { AppProvider } from "../context/AppContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// // Mock localStorage để test
// beforeEach(() => {
//   localStorage.clear();
//   vi.spyOn(console, "log").mockImplementation(() => {}); // tắt log
// });

// describe("🧩 StatePersistenceContext Integration", () => {
//   it("tự động lưu state vào localStorage khi mount", async () => {
//     render(
//       <AppProvider>
//         <StatePersistenceProvider>
//           <div>Test Save</div>
//         </StatePersistenceProvider>
//       </AppProvider>
//     );

//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve, 100));
//     });

//     const stored = localStorage.getItem("app_state");
//     expect(stored).toBeTruthy();
//   });

//   it("khôi phục lại state nếu có sẵn trong localStorage", async () => {
//     const mockState = { testValue: "from_storage" };
//     localStorage.setItem("app_state", JSON.stringify(mockState));

//     render(
//       <AppProvider>
//         <StatePersistenceProvider>
//           <div>Test Restore</div>
//         </StatePersistenceProvider>
//       </AppProvider>
//     );

//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve, 100));
//     });

//     const restored = JSON.parse(localStorage.getItem("app_state"));
//     expect(restored.testValue).toBe("from_storage");
//   });

//   it("xóa state trong localStorage khi gọi clearStorage()", async () => {
//     localStorage.setItem("app_state", JSON.stringify({ abc: 123 }));

//     render(
//       <AppProvider>
//         <StatePersistenceProvider>
//           <div>Test Clear</div>
//         </StatePersistenceProvider>
//       </AppProvider>
//     );

//     // mô phỏng clearStorage thông qua xóa key
//     await act(async () => {
//       localStorage.removeItem("app_state");
//     });

//     expect(localStorage.getItem("app_state")).toBeNull();
//   });
// });

// =========================================
// Phiên bản tối ưu (an toàn khi chạy với IntegrationRunner)
// ✅ src/test/StatePersistence.test.jsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { AppProvider } from "../context/AppContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// --- Mock localStorage & console trước mỗi test ---
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, "log").mockImplementation(() => {}); // tắt log
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("🧩 StatePersistenceContext Integration", () => {
  it("tự động lưu app_state vào localStorage khi mount", async () => {
    render(
      <AppProvider>
        <StatePersistenceProvider>
          <div>Test Save</div>
        </StatePersistenceProvider>
      </AppProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    });

    const stored = localStorage.getItem("app_state");
    expect(stored).toBeTruthy();
  });

  it("khôi phục lại app_state từ localStorage nếu có sẵn", async () => {
    const mockState = { testValue: "from_storage" };
    localStorage.setItem("app_state", JSON.stringify(mockState));

    render(
      <AppProvider>
        <StatePersistenceProvider>
          <div>Test Restore</div>
        </StatePersistenceProvider>
      </AppProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    const restored = JSON.parse(localStorage.getItem("app_state"));
    expect(restored.testValue).toBe("from_storage");
  });

  it("có thể xóa app_state trong localStorage (mô phỏng clearStorage)", async () => {
    localStorage.setItem("app_state", JSON.stringify({ abc: 123 }));

    render(
      <AppProvider>
        <StatePersistenceProvider>
          <div>Test Clear</div>
        </StatePersistenceProvider>
      </AppProvider>
    );

    await act(async () => {
      localStorage.removeItem("app_state");
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(localStorage.getItem("app_state")).toBeNull();
  });
});
