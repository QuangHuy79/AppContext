// import React, { useEffect, useState } from "react";
// import { AppProvider } from "../context/AppContext";
// import { useAPI } from "../context/APIContext/APIContext";
// import { useAuth } from "../context/AuthContext/AuthContext";
// import { useDataSync } from "../context/modules/DataSyncContext";
// import { useCache } from "../context/modules/CacheContext";
// import { useStorage } from "../context/modules/StorageContext";
// import toastService from "../services/toastService";

// const IntegrationCore = () => {
//   const { get, post } = useAPI();
//   const { login, logout, user, token } = useAuth();
//   const { syncedData, syncNow } = useDataSync();
//   const { getCache, setCache, clearCache } = useCache();
//   const { saveData, getData, clearData } = useStorage();

//   const [logs, setLogs] = useState([]);

//   const log = (msg) => {
//     console.log(`[IntegrationTest] ${msg}`);
//     setLogs((prev) => [...prev, msg]);
//   };

//   useEffect(() => {
//     const runTest = async () => {
//       try {
//         log("=== Bắt đầu Integration Test ===");

//         // 1️⃣ Login qua AuthContext (mock json-server)
//         const loginRes = await login("admin", "123456");
//         log(`Đăng nhập thành công: ${JSON.stringify(loginRes)}`);

//         // 2️⃣ Gọi API thật qua APIContext
//         const data = await get("http://localhost:3001/posts");
//         log(`Fetch data: ${data.length} item`);

//         // 3️⃣ Lưu cache và kiểm tra
//         setCache("posts", data);
//         log(`Cache posts: ${getCache("posts").length} item`);

//         // 4️⃣ Đồng bộ qua DataSyncContext
//         await syncNow();
//         log(`DataSync: ${JSON.stringify(syncedData)}`);

//         // 5️⃣ Lưu toàn bộ state vào StorageContext
//         saveData("app_state", { token, user, data });
//         log(`Saved state: ${JSON.stringify(getData("app_state"))}`);

//         // 6️⃣ Clear cache và storage → rồi reload
//         clearCache();
//         clearData();
//         log("Đã xóa cache và storage, kiểm tra reload khôi phục...");

//         toastService.show("success", "Integration Test hoàn tất", "TEST ✅");
//       } catch (error) {
//         toastService.show("error", error.message, "Integration Test ❌");
//         log(`❌ Lỗi: ${error.message}`);
//       }
//     };

//     runTest();
//   }, []);

//   return (
//     <div className="p-4 font-mono text-sm bg-gray-900 text-green-400">
//       <h2 className="text-lg text-yellow-400 mb-2">Integration Test Logs</h2>
//       <pre>{logs.join("\n")}</pre>
//     </div>
//   );
// };

// export default function TestIntegration() {
//   return (
//     <AppProvider>
//       <IntegrationCore />
//     </AppProvider>
//   );
// }

// ===========================
// import React, { useEffect, useState } from "react";
// import { AppProvider } from "../context/AppContext";
// import { APIProvider, useAPI } from "../context/APIContext/APIContext";
// import { useAuth } from "../context/AuthContext/AuthContext";
// import { useDataSync } from "../context/modules/DataSyncContext";
// import { useCache } from "../context/modules/CacheContext";
// import { useStorage } from "../context/modules/StorageContext";
// import toastService from "../services/toastService";

// const TestIntegration = () => {
//   const [logs, setLogs] = useState([]);

//   const log = (msg) => {
//     console.log(`[IntegrationTest] ${msg}`);
//     setLogs((prev) => [...prev, msg]);
//   };

//   useEffect(() => {
//     let didRun = false; // đảm bảo effect chỉ chạy 1 lần

//     const runTest = async () => {
//       if (didRun) return;
//       didRun = true;

//       // Lấy tất cả hook bên trong effect để đảm bảo provider đã mount
//       const api = useAPI();
//       const { get, post } = api || {};
//       const { login, logout, user, token } = useAuth();
//       const { syncedData, syncNow } = useDataSync();
//       const { getCache, setCache, clearCache } = useCache();
//       const { saveData, getData, clearData } = useStorage();

//       try {
//         log("=== Bắt đầu Integration Test ===");

//         // 1️⃣ Login qua AuthContext (mock json-server)
//         const loginRes = await login("admin", "123456");
//         log(`Đăng nhập thành công: ${JSON.stringify(loginRes)}`);

//         // 2️⃣ Gọi API thật qua APIContext (BASE_URL = 3001)
//         const data = get ? await get("/posts") : [];
//         const dataCount = Array.isArray(data) ? data.length : 0;
//         log(`Fetch data: ${dataCount} item`);

//         // 3️⃣ Lưu cache và kiểm tra
//         setCache && setCache("posts", data);
//         const cached = (getCache && getCache("posts")) || [];
//         log(`Cache posts: ${cached.length} item`);

//         // 4️⃣ Đồng bộ qua DataSyncContext
//         const synced = syncNow ? await syncNow() : {};
//         log(`DataSync: ${JSON.stringify(synced || {})}`);

//         // 5️⃣ Lưu toàn bộ state vào StorageContext
//         saveData && saveData("app_state", { token, user, data });
//         const saved = (getData && getData("app_state")) || {};
//         log(`Saved state: ${JSON.stringify(saved)}`);

//         // 6️⃣ Clear cache và storage → rồi reload
//         clearCache && clearCache();
//         clearData && clearData();
//         log("Đã xóa cache và storage, kiểm tra reload khôi phục...");

//         toastService.show("success", "Integration Test hoàn tất", "TEST ✅");
//       } catch (error) {
//         toastService.show("error", error.message, "Integration Test ❌");
//         log(`❌ Lỗi: ${error.message}`);
//       }
//     };

//     runTest();
//   }, []); // dependency [] → chỉ chạy 1 lần

//   return (
//     <div className="p-4 font-mono text-sm bg-gray-900 text-green-400">
//       <h2 className="text-lg text-yellow-400 mb-2">Integration Test Logs</h2>
//       <pre>{logs.join("\n")}</pre>
//     </div>
//   );
// };

// export default function WrappedTestIntegration() {
//   return (
//     <APIProvider>
//       <AppProvider>
//         <TestIntegration />
//       </AppProvider>
//     </APIProvider>
//   );
// }

// ================================
// import React, { useEffect } from "react";
// import { AppProvider } from "../context/AppContext";
// import { useAPI } from "../context/APIContext/APIContext";

// const IntegrationRunner = () => {
//   const { get } = useAPI();

//   useEffect(() => {
//     const runTest = async () => {
//       console.log("[IntegrationTest] === Bắt đầu Integration Test ===");
//       try {
//         const data = await get("/posts");
//         console.log("[IntegrationTest] ✅ API GET OK:", data);
//       } catch (err) {
//         console.error("[IntegrationTest] ❌ Lỗi:", err.message);
//       }
//     };

//     runTest();
//   }, [get]);

//   return <div>Integration Test Logs</div>;
// };

// export default function TestIntegration() {
//   return (
//     <AppProvider>
//       <IntegrationRunner />
//     </AppProvider>
//   );
// }

// =========================
// import React, { useEffect, useState } from "react";
// import { AppProvider } from "../context/AppContext";
// import { useAPI } from "../context/APIContext/APIContext";
// import { useAuth } from "../context/AuthContext/AuthContext";
// import { useDataSync } from "../context/modules/DataSyncContext";
// import { useCache } from "../context/modules/CacheContext";
// import { useStorage } from "../context/modules/StorageContext";
// import toastService from "../services/toastService";

// const IntegrationRunner = () => {
//   // Hooks chỉ gọi bên trong component
//   const { get, post } = useAPI();
//   const { login, logout, user, token } = useAuth();
//   const { syncedData, syncNow } = useDataSync();
//   const { getCache, setCache, clearCache } = useCache();
//   const { saveData, getData, clearData } = useStorage();

//   const [logs, setLogs] = useState([]);

//   // log callback an toàn, setLogs đã mount
//   const log = (msg) => {
//     console.log(`[IntegrationTest] ${msg}`);
//     setLogs((prev) => [...prev, msg]);
//   };

//   useEffect(() => {
//     const runTest = async () => {
//       log("=== Bắt đầu Integration Test ===");

//       try {
//         // 1️⃣ Login qua AuthContext
//         const loginRes = await login("admin", "123456");
//         log(`Đăng nhập thành công: ${JSON.stringify(loginRes)}`);

//         // 2️⃣ Gọi API thật qua APIContext
//         const posts = await get("/posts");
//         log(`Fetch posts: ${posts.length} item`);

//         const newPost = await post("/posts", {
//           title: "Bài test integration",
//           body: "Dữ liệu thêm bởi Integration Test",
//         });
//         log(`Post mới thêm: ${JSON.stringify(newPost)}`);

//         // 3️⃣ Lưu cache và kiểm tra
//         setCache("posts", posts);
//         log(`Cache posts: ${getCache("posts")?.length || 0} item`);

//         // 4️⃣ Đồng bộ dữ liệu qua DataSyncContext
//         await syncNow();
//         log(`DataSync: ${JSON.stringify(syncedData)}`);

//         // 5️⃣ Lưu toàn bộ state vào StorageContext
//         saveData("app_state", { token, user, posts });
//         log(`Saved state: ${JSON.stringify(getData("app_state"))}`);

//         // 6️⃣ Clear cache & storage
//         clearCache();
//         clearData();
//         log("Đã xóa cache và storage, kiểm tra reload khôi phục...");

//         toastService.show("success", "Integration Test hoàn tất", "TEST ✅");
//       } catch (error) {
//         toastService.show("error", error.message, "Integration Test ❌");
//         log(`❌ Lỗi: ${error.message}`);
//       }
//     };

//     runTest();
//   }, [
//     get,
//     post,
//     login,
//     setCache,
//     getCache,
//     syncNow,
//     saveData,
//     getData,
//     clearCache,
//     clearData,
//     syncedData,
//     token,
//     user,
//   ]);

//   return (
//     <div className="p-4 font-mono text-sm bg-gray-900 text-green-400">
//       <h2 className="text-lg text-yellow-400 mb-2">Integration Test Logs</h2>
//       <pre>{logs.join("\n")}</pre>
//     </div>
//   );
// };

// export default function TestIntegration() {
//   // AppProvider wrap toàn bộ component → context tồn tại
//   return (
//     <AppProvider>
//       <IntegrationRunner />
//     </AppProvider>
//   );
// }

// ==============================
// import React, { useEffect, useState } from "react";
// import { AppProvider } from "../context/AppContext";
// import { useAPI } from "../context/APIContext/APIContext";
// import { useAuth } from "../context/AuthContext/AuthContext";
// import { useDataSync } from "../context/modules/DataSyncContext";
// import { useCache } from "../context/modules/CacheContext";
// import { useStorage } from "../context/modules/StorageContext";
// import toastService from "../services/toastService";

// const IntegrationRunner = () => {
//   const { get, post } = useAPI();
//   const { login, logout, user, token } = useAuth();
//   const { syncedData, syncNow } = useDataSync();
//   const { getCache, setCache, clearCache } = useCache();
//   const { saveData, getData, clearData } = useStorage();

//   const [logs, setLogs] = useState([]);

//   const log = (msg) => {
//     console.log(`[IntegrationTest] ${msg}`);
//     setLogs((prev) => [...prev, msg]);
//   };

//   useEffect(() => {
//     let mounted = true; // ✅ tránh chạy khi component đã unmount

//     const runTest = async () => {
//       if (!mounted) return;
//       log("=== Bắt đầu Integration Test ===");

//       try {
//         // 1️⃣ Login
//         const loginRes = await login("admin", "123456");
//         log(`Đăng nhập thành công: ${JSON.stringify(loginRes)}`);

//         // 2️⃣ Gọi API
//         const posts = await get("/posts");
//         log(`Fetch posts: ${posts.length} item`);

//         const newPost = await post("/posts", {
//           title: "Bài test integration",
//           body: "Dữ liệu thêm bởi Integration Test",
//         });
//         log(`Post mới thêm: ${JSON.stringify(newPost)}`);

//         // 3️⃣ Lưu cache
//         setCache("posts", posts);
//         log(`Cache posts: ${getCache("posts")?.length || 0} item`);

//         // 4️⃣ Đồng bộ dữ liệu
//         await syncNow();
//         log(`DataSync: ${JSON.stringify(syncedData)}`);

//         // 5️⃣ Lưu state
//         saveData("app_state", { token, user, posts });
//         log(`Saved state: ${JSON.stringify(getData("app_state"))}`);

//         // 6️⃣ Clear cache & storage
//         clearCache();
//         clearData();
//         log("Đã xóa cache và storage, kiểm tra reload khôi phục...");

//         toastService.show("success", "Integration Test hoàn tất", "TEST ✅");
//       } catch (error) {
//         toastService.show("error", error.message, "Integration Test ❌");
//         log(`❌ Lỗi: ${error.message}`);
//       }
//     };

//     runTest();

//     return () => {
//       mounted = false; // ✅ clean up khi unmount
//     };
//   }, []); // 🔑 dependency array rỗng → chạy đúng 1 lần

//   return (
//     <div className="p-4 font-mono text-sm bg-gray-900 text-green-400">
//       <h2 className="text-lg text-yellow-400 mb-2">Integration Test Logs</h2>
//       <pre>{logs.join("\n")}</pre>
//     </div>
//   );
// };

// export default function TestIntegration() {
//   return (
//     <AppProvider>
//       <IntegrationRunner />
//     </AppProvider>
//   );
// }

// một file IntegrationRunner.js chỉ chứa logic test,
// một file TestIntegration.jsx chỉ render log UI và gọi runner
// TestIntegration.jsx
// import React from "react";
// import { AppProvider } from "../context/AppContext";
// import IntegrationRunner from "./IntegrationRunner";

// export default function TestIntegration() {
//   return (
//     <AppProvider>
//       <IntegrationRunner />
//     </AppProvider>
//   );
// }

// ===============
// src/test/TestIntegration.jsx
// src/test/TestIntegration.jsx
import React, { useEffect, useState } from "react";
import { AppProvider, useAppContext } from "../context/AppContext";
import { useAPI } from "../context/APIContext/APIContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useDataSync } from "../context/modules/DataSyncContext";
import { useCache } from "../context/modules/CacheContext";
import { useStorage } from "../context/modules/StorageContext";
import toastService from "../services/toastService";

const IntegrationRunner = () => {
  const { ready } = useAppContext();
  const [logs, setLogs] = useState([]);

  const log = (msg) => {
    console.log(`[IntegrationTest] ${msg}`);
    setLogs((prev) => [...prev, msg]);
  };

  useEffect(() => {
    if (!ready) return; // 🔑 Chờ AppProvider init xong

    const runTest = async () => {
      log("=== Bắt đầu Integration Test ===");

      try {
        // 🔹 Gọi hook module bên trong effect
        const { get, post } = useAPI();
        const { login } = useAuth();
        const { syncedData, syncNow } = useDataSync();
        const { getCache, setCache, clearCache } = useCache();
        const { saveData, getData, clearData } = useStorage();

        // 1️⃣ Login
        const loginRes = await login("admin", "123456");
        log(`Đăng nhập thành công: ${JSON.stringify(loginRes)}`);

        // 2️⃣ Fetch posts
        const posts = await get("/posts");
        log(`Fetch posts: ${posts.length} item`);

        // 3️⃣ Thêm post mới
        const newPost = await post("/posts", {
          title: "Bài test integration",
          body: "Dữ liệu thêm bởi Integration Test",
        });
        log(`Post mới thêm: ${JSON.stringify(newPost)}`);

        // 4️⃣ Cache posts
        setCache("posts", posts);
        log(`Cache posts: ${getCache("posts")?.length || 0} item`);

        // 5️⃣ Đồng bộ dữ liệu
        await syncNow();
        log(`DataSync: ${JSON.stringify(syncedData)}`);

        // 6️⃣ Lưu state
        saveData("app_state", { posts, user: loginRes });
        log(`Saved state: ${JSON.stringify(getData("app_state"))}`);

        // 7️⃣ Clear cache & storage
        clearCache();
        clearData();
        log("Đã xóa cache và storage");

        toastService.show("success", "Integration Test hoàn tất", "TEST ✅");
      } catch (err) {
        log(`❌ Lỗi: ${err.message}`);
        toastService.show("error", err.message, "Integration Test ❌");
      }
    };

    runTest();
  }, [ready]);

  return (
    <div className="p-4 font-mono text-sm bg-gray-900 text-green-400">
      <h2 className="text-lg text-yellow-400 mb-2">Integration Test Logs</h2>
      <pre>{logs.join("\n")}</pre>
    </div>
  );
};

export default function TestIntegration() {
  return (
    <AppProvider>
      <IntegrationRunner />
    </AppProvider>
  );
}
