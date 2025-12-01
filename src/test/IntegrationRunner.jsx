// // src/test/IntegrationRunner.jsx
// import React from "react";
// import { AppProvider } from "../context/AppContext";
// import { useNetwork } from "../context/modules/NetworkContext";
// import { useDevice } from "../context/modules/DeviceContext";
// import { useSettings } from "../context/modules/SettingsContext";
// import { useAuth } from "../context/AuthContext/useAuth";
// import { useData } from "../context/modules/DataContext";
// import { useDataSync } from "../context/modules/DataSyncContext";
// import { useAPI } from "../context/APIContext/APIContext";
// import { useCache } from "../context/modules/CacheContext";
// import { useStorage } from "../context/modules/StorageContext";
// import { useUI } from "../context/modules/UIContext";

// const RuntimeStatus = () => {
//   const network = useNetwork();
//   const device = useDevice();
//   const settings = useSettings();
//   const auth = useAuth();
//   const api = useAPI();
//   const data = useData();
//   const sync = useDataSync();
//   const cache = useCache();
//   const storage = useStorage();
//   const ui = useUI();

//   React.useEffect(() => {
//     console.group("[IntegrationRunner] Runtime Snapshot");
//     console.log("🌐 Network:", network);
//     console.log("💻 Device:", device);
//     console.log("⚙️ Settings:", settings);
//     console.log("🔐 Auth:", auth.user);
//     console.log("📡 API:", api);
//     console.log("💾 Data:", data);
//     console.log("🔁 Sync:", sync);
//     console.log("🧠 Cache:", cache);
//     console.log("📦 Storage:", storage);
//     console.log("🎨 UI:", ui);
//     console.groupEnd();
//   }, [network, device, settings, auth, api, data, sync, cache, storage, ui]);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>✅ Integration Runner</h2>
//       <p>Kiểm tra console log để xem trạng thái AppContext runtime.</p>
//       <p>
//         <strong>Network:</strong> {network.isOnline ? "Online" : "Offline"}
//       </p>
//       <p>
//         <strong>Theme:</strong> {settings.theme}
//       </p>
//       <p>
//         <strong>Auth:</strong> {auth.user ? auth.user.name : "Chưa đăng nhập"}
//       </p>
//       <p>
//         <strong>Cache items:</strong> {Object.keys(cache || {}).length}
//       </p>
//     </div>
//   );
// };

// export default function IntegrationRunner() {
//   return (
//     <AppProvider>
//       <RuntimeStatus />
//     </AppProvider>
//   );
// }

// ===========================
// // ✅ src/test/IntegrationRunner.jsx
// import React from "react";
// import { describe, it, expect, beforeEach, vi } from "vitest";
// import { render, screen, act } from "@testing-library/react";

// // // Import tất cả context chính
// // import { AppProvider } from "../context/AppContext";
// // import { NetworkProvider } from "../context/NetworkContext";
// // import { DeviceProvider } from "../context/DeviceContext";
// // import { SettingsProvider } from "../context/SettingsContext";
// // import { UIProvider } from "../context/UIContext";
// // import { DataProvider } from "../context/DataContext";
// // import { AuthProvider } from "../context/AuthContext";
// // import { DataSyncProvider } from "../context/DataSyncContext";
// // import { APIProvider } from "../context/APIContext";
// // import { CacheProvider } from "../context/CacheContext";
// // import { NotificationProvider } from "../context/NotificationContext";
// // import { StorageProvider } from "../context/StorageContext";
// // import { StatePersistenceProvider } from "../context/StatePersistenceContext";
// import { AppProvider } from "../context/AppContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext.jsx";

// // --- MODULE CONTEXTS ---
// import { NetworkProvider } from "../context/modules/NetworkContext.jsx";
// import { DeviceProvider } from "../context/modules/DeviceContext.jsx";
// import { SettingsProvider } from "../context/modules/SettingsContext.jsx";
// import { UIProvider } from "../context/modules/UIContext.jsx";
// import { DataProvider } from "../context/modules/DataContext.jsx";
// import { DataSyncProvider } from "../context/modules/DataSyncContext.jsx";
// import { AuthProvider } from "../context/AuthContext/AuthContext.jsx";
// import { APIProvider } from "../context/APIContext/APIContext.jsx";
// import { CacheProvider } from "../context/modules/CacheContext.jsx";
// import { NotificationProvider } from "../context/modules/NotificationContext.jsx";
// import { StorageProvider } from "../context/modules/StorageContext.jsx";

// // --- TEST UI ---
// import TestStatePersistence from "./TestStatePersistence.jsx";

// // Mock console & localStorage
// beforeEach(() => {
//   vi.spyOn(console, "log").mockImplementation(() => {});
//   localStorage.clear();
//   sessionStorage.clear();
// });

// describe("🚀 AppContext Modules – Integration Suite", () => {
//   it("mount toàn bộ Providers không lỗi", async () => {
//     render(
//       <AppProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <SettingsProvider>
//               <UIProvider>
//                 <AuthProvider>
//                   <APIProvider>
//                     <CacheProvider>
//                       <NotificationProvider>
//                         <StorageProvider>
//                           <DataProvider>
//                             <DataSyncProvider>
//                               <StatePersistenceProvider>
//                                 <div data-testid="integration-ok">
//                                   Integration OK
//                                 </div>
//                               </StatePersistenceProvider>
//                             </DataSyncProvider>
//                           </DataProvider>
//                         </StorageProvider>
//                       </NotificationProvider>
//                     </CacheProvider>
//                   </APIProvider>
//                 </AuthProvider>
//               </UIProvider>
//             </SettingsProvider>
//           </DeviceProvider>
//         </NetworkProvider>
//       </AppProvider>
//     );

//     const ok = await screen.findByTestId("integration-ok");
//     expect(ok).toBeTruthy();
//   });

//   it("StatePersistenceContext hoạt động đồng bộ với AppState", async () => {
//     render(
//       <AppProvider>
//         <StatePersistenceProvider>
//           <div>StatePersistence Integration</div>
//         </StatePersistenceProvider>
//       </AppProvider>
//     );

//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve, 150));
//     });

//     // Kiểm tra có lưu app_state
//     const saved = localStorage.getItem("app_state");
//     expect(saved).toBeTruthy();

//     // Mô phỏng reload (khôi phục)
//     const mock = { restored: true, ts: Date.now() };
//     localStorage.setItem("app_state", JSON.stringify(mock));

//     render(
//       <AppProvider>
//         <StatePersistenceProvider>
//           <div>Reload</div>
//         </StatePersistenceProvider>
//       </AppProvider>
//     );

//     await act(async () => {
//       await new Promise((resolve) => setTimeout(resolve, 150));
//     });

//     const restored = JSON.parse(localStorage.getItem("app_state"));
//     expect(restored.restored).toBe(true);
//   });
// });

// =========================
// ✅ src/test/IntegrationRunner.jsx
// import React from "react";
// import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
// import { render, screen, act, waitFor } from "@testing-library/react";

// import { AppProvider } from "../context/AppContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext.jsx";
// import { NetworkProvider } from "../context/modules/NetworkContext.jsx";
// import { DeviceProvider } from "../context/modules/DeviceContext.jsx";
// import { SettingsProvider } from "../context/modules/SettingsContext.jsx";
// import { UIProvider } from "../context/modules/UIContext.jsx";
// import { DataProvider } from "../context/modules/DataContext.jsx";
// import { DataSyncProvider } from "../context/modules/DataSyncContext.jsx";
// import { AuthProvider } from "../context/AuthContext/AuthContext.jsx";
// import { APIProvider } from "../context/APIContext/APIContext.jsx";
// import { CacheProvider } from "../context/modules/CacheContext.jsx";
// import { NotificationProvider } from "../context/modules/NotificationContext.jsx";
// import { StorageProvider } from "../context/modules/StorageContext.jsx";

// // import TestStatePersistence from "./TestStatePersistence.jsx";

// beforeEach(() => {
//   vi.spyOn(console, "log").mockImplementation(() => {});
//   localStorage.clear();
//   sessionStorage.clear();
// });

// afterEach(() => {
//   vi.restoreAllMocks();
// });

// describe("🚀 AppContext Modules – Integration Suite", () => {
//   it("mount toàn bộ Providers không lỗi", async () => {
//     render(
//       <AppProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <SettingsProvider>
//               <UIProvider>
//                 <AuthProvider>
//                   <APIProvider>
//                     <CacheProvider>
//                       <NotificationProvider>
//                         <StorageProvider>
//                           <DataProvider>
//                             <DataSyncProvider>
//                               <StatePersistenceProvider>
//                                 <div data-testid="integration-ok">
//                                   Integration OK
//                                 </div>
//                               </StatePersistenceProvider>
//                             </DataSyncProvider>
//                           </DataProvider>
//                         </StorageProvider>
//                       </NotificationProvider>
//                     </CacheProvider>
//                   </APIProvider>
//                 </AuthProvider>
//               </UIProvider>
//             </SettingsProvider>
//           </DeviceProvider>
//         </NetworkProvider>
//       </AppProvider>
//     );

//     const ok = await screen.findByTestId("integration-ok");
//     expect(ok).toBeTruthy();
//   });

//   it("StatePersistenceContext hoạt động đồng bộ với AppState", async () => {
//     render(
//       <AppProvider>
//         <StatePersistenceProvider>
//           {/* <TestStatePersistence /> */}
//           <div data-testid="state-persistence-test">
//             StatePersistence Active
//           </div>
//         </StatePersistenceProvider>
//       </AppProvider>
//     );

//     await waitFor(() => {
//       const saved = localStorage.getItem("app_state");
//       expect(saved).toBeTruthy();
//     });

//     const mock = { restored: true, ts: Date.now() };
//     localStorage.setItem("app_state", JSON.stringify(mock));

//     render(
//       <AppProvider>
//         <StatePersistenceProvider>
//           <TestStatePersistence />
//         </StatePersistenceProvider>
//       </AppProvider>
//     );

//     await waitFor(() => {
//       const restored = JSON.parse(localStorage.getItem("app_state"));
//       expect(restored.restored).toBe(true);
//     });
//   });
// });

// ==================================
import React from "react";
import { AppProvider } from "../context/AppContext";
import { NetworkProvider } from "../context/modules/NetworkContext";
import { DeviceProvider } from "../context/modules/DeviceContext";
import { SettingsProvider } from "../context/modules/SettingsContext";
import { UIProvider } from "../context/modules/UIContext";
import { DataProvider } from "../context/modules/DataContext";
import { DataSyncProvider } from "../context/modules/DataSyncContext";
// import { AuthProvider } from "../context/modules/AuthContext";
import { AuthProvider } from "../context/AuthContext/AuthContext";
import { APIProvider } from "../context/APIContext/APIContext";
import { CacheProvider } from "../context/modules/CacheContext";
import { NotificationProvider } from "../context/modules/NotificationContext";
import { StorageProvider } from "../context/modules/StorageContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

export default function IntegrationRunner() {
  return (
    <AppProvider>
      <NetworkProvider>
        <DeviceProvider>
          <SettingsProvider>
            <UIProvider>
              <StorageProvider>
                <CacheProvider>
                  <NotificationProvider>
                    <APIProvider>
                      <AuthProvider>
                        <DataProvider>
                          <DataSyncProvider>
                            <StatePersistenceProvider>
                              <div
                                data-testid="integration-runner"
                                className="p-4 text-gray-700 text-sm"
                              >
                                <h2 className="font-bold text-lg mb-2">
                                  ✅ Integration Runner Active
                                </h2>
                                <p>
                                  Tất cả context module đã được mount thành
                                  công.
                                </p>
                                <p>
                                  Kiểm tra console để xem log hoạt động của
                                  AppContext, DataSync, API, Cache, v.v.
                                </p>
                                <div
                                  data-testid="state-persistence-test"
                                  className="mt-2 text-xs text-gray-500"
                                >
                                  StatePersistence Active
                                </div>
                              </div>
                            </StatePersistenceProvider>
                          </DataSyncProvider>
                        </DataProvider>
                      </AuthProvider>
                    </APIProvider>
                  </NotificationProvider>
                </CacheProvider>
              </StorageProvider>
            </UIProvider>
          </SettingsProvider>
        </DeviceProvider>
      </NetworkProvider>
    </AppProvider>
  );
}
