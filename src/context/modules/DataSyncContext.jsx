// src/context/modules/DataSyncContext.jsx
import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import toastService from "../../services/toastService";
import { dataService } from "../../services/dataService";

// Hooks / contexts trong dự án (cùng folder modules)
import { useNetwork } from "./NetworkContext";
import { useCache } from "./CacheContext";
import { useStorage } from "./StorageContext";
import { useData } from "./DataContext";
// Auth hook nằm ở context/AuthContext (theo cấu trúc dự án)
import { useAuth } from "../AuthContext/useAuth";
import { useUI } from "./UIContext";

/**
 * DataSyncContext
 *
 * Tính năng:
 * - syncNow(): đồng bộ dữ liệu thủ công (guarded)
 * - auto-sync: kiểm tra mỗi phút, nếu online + authenticated + lastSync > 10 phút => gọi syncNow()
 * - lưu lastSync vào StorageContext (localStorage) để persist qua reload
 *
 * Lưu ý: không thêm queue/hàng đợi mới, không thay đổi kiến trúc bạn đã build.
 */

export const DataSyncContext = createContext({
  lastSync: null,
  syncing: false,
  syncNow: async () => {},
});

export const DataSyncProvider = ({ children }) => {
  // state nội bộ
  const [lastSync, setLastSync] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // integration với các module
  const { isOnline } = useNetwork(); // kiểm tra network
  const { user, isAuthenticated } = useAuth(); // kiểm tra auth
  const { setCache } = useCache(); // cập nhật cache nếu cần
  const { getItem, setItem } = useStorage(); // lưu lastSync vào storage
  const { loadData } = useData() || {}; // loadData từ DataContext (nếu có)
  const ui = useUI(); // Ui context (có dispatch và helpers)

  // --------------------------------------------
  // 1) syncNow: hàm gọi để đồng bộ thủ công
  //    giữ logic gốc nhưng tích hợp loadData + lưu lastSync
  // --------------------------------------------
  const syncNow = useCallback(
    async (opts = {}) => {
      // opts có thể mở rộng (e.g., { showToasts: true })
      const showToasts = opts.showToasts ?? true;

      // guard: nếu đang đồng bộ thì bỏ qua
      if (syncing) return;

      // nếu offline => thông báo và bỏ qua
      if (!isOnline) {
        if (showToasts)
          toastService.show(
            "info",
            "Bạn đang offline — đồng bộ bị hoãn",
            "DataSync"
          );
        return;
      }

      // nếu chưa đăng nhập (tùy chính sách) => bỏ qua
      if (!isAuthenticated) {
        if (showToasts)
          toastService.show(
            "info",
            "Chưa đăng nhập — không thể đồng bộ",
            "DataSync"
          );
        return;
      }

      setSyncing(true);
      if (showToasts)
        toastService.show("info", "Bắt đầu đồng bộ dữ liệu...", "Đang đồng bộ");

      try {
        // --- giữ nguyên kiểu giả lập / call API như bạn có thể định nghĩa ---
        // Khi có dataService.syncAll hoặc tương tự, gọi ở đây
        // Dùng dataService.fetchAll() như một fallback / hiện thực mock
        const serverData = await dataService.fetchAll();

        // Nếu có DataContext.loadData, gọi để update AppState bằng reducer (data flow bạn dùng)
        if (typeof loadData === "function") {
          // loadData sẽ dispatch DATA/SET_ALL... trong DataContext
          await loadData();
        } else {
          // nếu không có, cập nhật cache tạm
          try {
            setCache && setCache("data", serverData);
          } catch (e) {
            // ignore cache error
          }
        }

        // lưu lastSync vào state + storage
        const now = new Date();
        setLastSync(now);
        try {
          setItem && setItem("lastSync", now.toISOString());
        } catch (e) {
          /* ignore storage write errors */
        }

        // toast success
        if (showToasts)
          toastService.show(
            "success",
            "Dữ liệu đã được đồng bộ thành công!",
            "Hoàn tất"
          );
      } catch (error) {
        console.error("[DataSync] syncNow failed:", error);
        if (showToasts)
          toastService.show(
            "error",
            "Không thể đồng bộ dữ liệu. Vui lòng thử lại.",
            "Lỗi"
          );
      } finally {
        setSyncing(false);
      }
    },
    // các phụ thuộc: giữ nguyên sync guard và các hook
    [isOnline, isAuthenticated, syncing, loadData, setCache, setItem]
  );

  // --------------------------------------------
  // 2) Auto-sync: kiểm tra mỗi phút, gọi syncNow khi:
  //    - online
  //    - authenticated
  //    - không đang sync
  //    - lastSync không tồn tại hoặc đã quá 10 phút
  // --------------------------------------------
  useEffect(() => {
    const checkIntervalMs = 60 * 1000; // kiểm tra mỗi phút
    const TEN_MIN = 10 * 60 * 1000;

    const tick = async () => {
      try {
        if (!isOnline) return;
        if (!isAuthenticated) return;
        if (syncing) return;

        // đọc lastSync từ localStorage nếu chưa có state (tức vừa mount)
        let persisted = null;
        try {
          persisted = getItem ? getItem("lastSync") : null;
        } catch (e) {
          persisted = null;
        }

        const lastMs = lastSync
          ? new Date(lastSync).getTime()
          : persisted
          ? new Date(persisted).getTime()
          : 0;
        const needsSync = !lastMs || Date.now() - lastMs > TEN_MIN;

        if (needsSync) {
          // gọi syncNow (không hiện toast quá tải)
          await syncNow({ showToasts: true });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[DataSync] auto-sync tick error:", err);
      }
    };

    const interval = setInterval(tick, checkIntervalMs);
    // chạy 1 lần ngay khi mount để có phản ứng nhanh
    tick().catch(() => {});
    return () => clearInterval(interval);
  }, [isOnline, isAuthenticated, syncing, lastSync, syncNow, getItem]);

  // --------------------------------------------
  // 3) On mount: restore lastSync from storage (nếu có)
  // --------------------------------------------
  useEffect(() => {
    try {
      const saved = getItem ? getItem("lastSync") : null;
      if (saved) {
        setLastSync(new Date(saved));
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [getItem]);

  // --------------------------------------------
  // 4) Sync value memo
  // --------------------------------------------
  const value = useMemo(
    () => ({
      lastSync,
      syncedData: lastSync,
      syncing,
      syncNow,
    }),
    [lastSync, syncing, syncNow]
  );

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
};

export const useDataSync = () => useContext(DataSyncContext);

// ✅ Luồng chạy tổng thể (tóm tắt, đúng thực tế code)
// 1️⃣ Khi App vừa load → DataSyncProvider mount lần đầu
// (Effect khởi tạo chạy ngay)

// 1.1) Khởi tạo state
// lastSync = null

// syncing = false

// 1.2) Đọc lastSync từ StorageContext
// const saved = getItem("lastSync")
// → Nếu có → biến thành Date → set vào state lastSync.

// 2️⃣ Đồng bộ tự động lần đầu (auto-sync tick immediately)
// Ngay khi provider mount, hàm tick() trong auto-sync chạy một lần ngay lập tức:

// Tick kiểm tra:
// Network: isOnline === true

// Auth: isAuthenticated === true

// Không trong quá trình đồng bộ: !syncing

// Lần sync trước quá 10 phút hoặc chưa có lần sync → needsSync === true

// Nếu đủ điều kiện → gọi:
// syncNow({ showToasts: true })
// 3️⃣ Hàm syncNow() chạy khi auto-sync hoặc user gọi thủ công
// syncNow() gồm 7 bước:
// 3.1) Guard – chống chạy trùng
// Nếu syncing === true → return.

// 3.2) Check điều kiện hệ thống
// Nếu offline → bỏ, hiện toast

// Nếu chưa login → bỏ, hiện toast

// 3.3) Bắt đầu sync
// setSyncing(true)
// toastService.show("info", "...Đang đồng bộ")
// 3.4) Gọi API / dataService
// const serverData = await dataService.fetchAll()
// 3.5) Load dữ liệu mới vào DataContext
// Nếu DataContext có:

// await loadData();
// Ngược lại → cập nhật Cache:

// setCache("data", serverData)
// 3.6) Ghi lại thời điểm lastSync
// setLastSync(now);
// setItem("lastSync", now.toISOString());
// 3.7) Hoàn tất
// Hiện toast success

// setSyncing(false)

// 4️⃣ Auto-sync định kỳ
// Mỗi phút interval chạy:

// check every 60s:
//   if (online && authenticated && !syncing && lastSync > 10min)
//         → syncNow()
// Tick tiếp tục lặp cho đến khi unmount.

// 5️⃣ Giá trị trả ra Context
// Consumer nhận được:

// {
//   lastSync,
//   syncedData: lastSync,
//   syncing,
//   syncNow
// }
