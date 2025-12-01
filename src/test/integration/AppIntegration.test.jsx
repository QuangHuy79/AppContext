// import { render, screen, waitFor, act } from "@testing-library/react";
// import { AppProvider } from "../../context/AppContext";
// import { useAPI } from "../../context/APIContext";
// import { useDataSync } from "../../context/DataSyncContext";

// const TestIntegrationComponent = () => {
//   const { getData, postData } = useAPI();
//   const { syncNow } = useDataSync();

//   const handleFlow = async () => {
//     console.log("🚀 Bắt đầu Integration Flow (json-server:3001)");

//     // 1️⃣ Fetch dữ liệu hiện tại từ mock API
//     const posts = await getData("/posts");
//     console.log("📦 Posts ban đầu:", posts);

//     // 2️⃣ Tạo mới 1 post (test)
//     const newPost = await postData("/posts", {
//       title: "Bài test integration",
//       body: "Dữ liệu được thêm bởi Integration Test",
//     });
//     console.log("🆕 Post mới được thêm:", newPost);

//     // 3️⃣ Đồng bộ lại (nếu có context sync)
//     await syncNow();
//     console.log("🔁 Sync hoàn tất!");
//   };

//   return (
//     <div>
//       <button onClick={handleFlow}>Run Integration Flow</button>
//       <div data-testid="integration-status">ready</div>
//     </div>
//   );
// };

// describe("Integration Test: API + DataSync + json-server", () => {
//   it("should fetch, create, and sync posts from json-server:3001", async () => {
//     render(
//       <AppProvider>
//         <TestIntegrationComponent />
//       </AppProvider>
//     );

//     await act(async () => {
//       screen.getByText("Run Integration Flow").click();
//     });

//     await waitFor(() =>
//       expect(screen.getByTestId("integration-status")).toHaveTextContent(
//         "ready"
//       )
//     );

//     console.log("✅ Integration test hoàn tất (json-server:3001)");
//   });
// });

// ================================
// ------------------------------------------------------------
// src/test/integration/AppIntegration.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import IntegrationRunner from "../IntegrationRunner";
import { describe, it, expect } from "vitest";

describe("🔗 [Step 17] App Integration Test", () => {
  it("Khởi động AppProvider và render IntegrationRunner mà không lỗi", async () => {
    render(<IntegrationRunner />);

    expect(await screen.findByText(/Integration Runner/i)).toBeDefined();

    // await waitFor(() => {
    //   expect(screen.getByText(/Network:/i)).toBeDefined();
    //   expect(screen.getByText(/Theme:/i)).toBeDefined();
    // });
    await waitFor(() => {
      expect(screen.getByText(/Integration Runner Active/i)).toBeDefined();
      expect(screen.getByText(/StatePersistence Active/i)).toBeDefined();
    });
  });

  it("Đồng bộ dữ liệu thật từ API mock (json-server)", async () => {
    const response = await fetch("http://localhost:3001/posts");
    const posts = await response.json();
    console.log("[IntegrationTest] API posts:", posts);

    expect(Array.isArray(posts)).toBe(true);
  });

  it("Đăng nhập user từ API mock (Auth + APIContext)", async () => {
    const res = await fetch("http://localhost:3001/users");
    const users = await res.json();
    console.log("[IntegrationTest] API users:", users);

    expect(users.length).toBeGreaterThan(0);
  });
});
