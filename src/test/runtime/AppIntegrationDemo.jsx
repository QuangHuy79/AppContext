// // src/test/runtime/AppIntegrationDemo.jsx
// import React from "react";
// import { useApp } from "../../hooks/useApp";

// export default function AppIntegrationDemo() {
//   const {
//     network,
//     device,
//     settings,
//     ui,
//     auth,
//     api,
//     data,
//     cache,
//     sync,
//     notify,
//     storage,
//   } = useApp();

//   return (
//     <div data-testid="integration-demo">
//       <h2>Integration Demo</h2>

//       <div data-testid="network-status">
//         Network: {network?.isOnline ? "online" : "offline"}
//       </div>

//       <div data-testid="device-type">Device: {device?.type}</div>
//       <div data-testid="theme">Theme: {settings?.theme}</div>
//       <div data-testid="lang">Lang: {settings?.language}</div>
//       <div data-testid="ui-ready">{ui?.ready ? "UI Ready" : "UI Loading"}</div>

//       <div data-testid="auth-status">
//         Auth: {auth?.token ? "Logged" : "Guest"}
//       </div>

//       <div data-testid="api-ready">
//         {api?.ready ? "API Ready" : "API Loading"}
//       </div>

//       <div data-testid="data-items">Data: {data?.items?.length ?? 0}</div>
//       <div data-testid="cache-size">Cache: {cache?.size ?? 0}</div>
//       <div data-testid="sync-status">
//         Sync: {sync?.lastSync ? "Done" : "Pending"}
//       </div>

//       <div data-testid="notify-count">
//         Notifications: {notify?.list?.length ?? 0}
//       </div>

//       <div data-testid="storage-ready">
//         Storage: {storage ? "Ready" : "Missing"}
//       </div>
//     </div>
//   );
// }

// // ==========================
// // src/AppRuntime/helpers/AppIntegrationDemo.jsx
// import React from "react";
// import { useApp } from "../../hooks/useApp";
// import { useNetwork } from "../../context/modules/NetworkContext";
// import { useStorage } from "../../context/modules/StorageContext"; // ✅ thêm

// export default function AppIntegrationDemo() {
//   const { state } = useApp();
//   const { isOnline } = useNetwork();
//   const storage = useStorage(); // ✅ thêm

//   return (
//     <div data-testid="integration-demo">
//       <h2>Integration Demo</h2>

//       <div data-testid="network-status">
//         Network: {isOnline ? "online" : "offline"}
//       </div>

//       <div data-testid="device-type">Device: {state.device?.type}</div>
//       <div data-testid="theme">Theme: {state.settings.theme}</div>
//       <div data-testid="lang">Lang: {state.settings.locale}</div>

//       <div data-testid="ui-ready">
//         {state.ui.loading ? "UI Loading" : "UI Ready"}
//       </div>

//       <div data-testid="auth-status">
//         Auth: {state.auth.token ? "Logged" : "Guest"}
//       </div>

//       <div data-testid="api-ready">
//         {state.api?.ready ? "API Ready" : "API Loading"}
//       </div>

//       <div data-testid="data-items">
//         Data: {state.data ? Object.keys(state.data).length : 0}
//       </div>

//       <div data-testid="cache-size">Cache: {state.cache?.size ?? 0}</div>

//       <div data-testid="sync-status">
//         Sync: {state.sync?.lastSync ? "Done" : "Pending"}
//       </div>

//       <div data-testid="notify-count">
//         Notifications: {state.notify?.list?.length ?? 0}
//       </div>

//       <div data-testid="storage-ready">
//         Storage: {storage ? "Ready" : "Missing"} {/* ✅ FIX */}
//       </div>
//     </div>
//   );
// }

// // ===============================
// import React from "react";
// import { AppProvider } from "../../context/AppContext";
// import useApp from "../../hooks/useApp";

// const AppIntegrationDemo = () => {
//   const {
//     network,
//     device,
//     settings,
//     ui,
//     auth,
//     api,
//     data,
//     cache,
//     sync,
//     notify,
//     storage,
//     app, // 🎯 module thứ 13 — app core (state + dispatch)
//   } = useApp();

//   return (
//     <div style={{ padding: 20, fontFamily: "monospace" }}>
//       <h2>App Integration Demo – FULL 13 Modules</h2>

//       {/* 1. Network */}
//       <section>
//         <h3>NetworkContext</h3>
//         <pre>{JSON.stringify(network, null, 2)}</pre>
//       </section>

//       {/* 2. Device */}
//       <section>
//         <h3>DeviceContext</h3>
//         <pre>{JSON.stringify(device, null, 2)}</pre>
//       </section>

//       {/* 3. Settings */}
//       <section>
//         <h3>SettingsContext</h3>
//         <pre>{JSON.stringify(settings, null, 2)}</pre>
//       </section>

//       {/* 4. UI */}
//       <section>
//         <h3>UIContext</h3>
//         <pre>{JSON.stringify(ui, null, 2)}</pre>
//       </section>

//       {/* 5. Auth */}
//       <section>
//         <h3>AuthContext</h3>
//         <pre>{JSON.stringify(auth, null, 2)}</pre>
//       </section>

//       {/* 6. API */}
//       <section>
//         <h3>APIContext</h3>
//         <pre>{JSON.stringify(api, null, 2)}</pre>
//       </section>

//       {/* 7. Data */}
//       <section>
//         <h3>DataContext</h3>
//         <pre>{JSON.stringify(data, null, 2)}</pre>
//       </section>

//       {/* 8. Cache */}
//       <section>
//         <h3>CacheContext</h3>
//         <pre>{JSON.stringify(cache, null, 2)}</pre>
//       </section>

//       {/* 9. DataSync */}
//       <section>
//         <h3>DataSyncContext</h3>
//         <pre>{JSON.stringify(sync, null, 2)}</pre>
//       </section>

//       {/* 10. Notification */}
//       <section>
//         <h3>NotificationContext</h3>
//         <pre>{JSON.stringify(notify, null, 2)}</pre>
//       </section>

//       {/* 11. Storage */}
//       <section>
//         <h3>StorageContext</h3>
//         <pre>{JSON.stringify(storage, null, 2)}</pre>
//       </section>

//       {/* 12. StatePersistence / App core */}
//       <section>
//         <h3>AppContext (Core)</h3>
//         <pre>{JSON.stringify(app, null, 2)}</pre>
//       </section>
//     </div>
//   );
// };

// const AppIntegrationDemoWrapper = () => (
//   <AppProvider>
//     <AppIntegrationDemo />
//   </AppProvider>
// );

// export default AppIntegrationDemoWrapper;

// =======================
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import AppRuntime, { preloadRuntimeModules } from "../../AppRuntime/AppRuntime";
import AppIntegrationDemo from "../AppRuntime/helpers/AppIntegrationDemo";

// Force navigator online để NetworkContext nhận trạng thái true
Object.defineProperty(window.navigator, "onLine", {
  value: true,
  configurable: true,
});

describe("Task 13 – Final Integration", () => {
  it("AppRuntime v1 final chạy đúng toàn bộ pipeline của 13 modules", async () => {
    // ---- Preload lazy modules trước render ----
    preloadRuntimeModules();
    window.dispatchEvent(new Event("online"));

    render(
      <AppRuntime options={{ lazyLoad: true }}>
        <AppIntegrationDemo />
      </AppRuntime>
    );

    // ---- Chờ các element cuối cùng của AppIntegrationDemo xuất hiện ----
    await waitFor(() =>
      expect(screen.getByTestId("integration-demo")).toBeInTheDocument()
    );

    // ---- Chờ fallback bị remove ----
    await waitFor(() => expect(screen.queryByTestId("fallback")).toBeNull());

    // ---- CHECK NETWORK ----
    await waitFor(() =>
      expect(screen.getByTestId("network-status").textContent).toContain(
        "online"
      )
    );

    // ---- CHECK CÁC PHẦN KHÁC ----
    const ids = [
      "device-type",
      "theme",
      "lang",
      "ui-ready",
      "auth-status",
      "api-ready",
      "data-items",
      "cache-size",
      "sync-status",
      "notify-count",
      "storage-ready",
    ];

    for (const id of ids) {
      await waitFor(() => expect(screen.getByTestId(id)).toBeInTheDocument());
    }
  });
});
