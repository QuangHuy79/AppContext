// SRC/context/modules/StorageContext.jsx
import React, { createContext, useCallback, useContext } from "react";
import toastService from "../../services/toastService";

export const StorageContext = createContext({
  setItem: () => {},
  getItem: () => {},
  removeItem: () => {},
  clear: () => {},
});

export const StorageProvider = ({ children }) => {
  // ✅ Set item (auto stringify object)
  const setItem = useCallback((key, value, useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      const data = typeof value === "string" ? value : JSON.stringify(value);
      store.setItem(key, data);
      toastService.show(
        "success",
        `Đã lưu ${key} vào ${useSession ? "session" : "local"} storage`,
        "Storage"
      );
    } catch (err) {
      console.error("Storage setItem error:", err);
      toastService.show("error", `Lỗi khi lưu ${key}`, "Storage Error");
    }
  }, []);

  // ✅ Get item (auto parse JSON)
  const getItem = useCallback((key, useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      const data = store.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null; // fallback nếu không phải JSON
    }
  }, []);

  // ✅ Remove item
  const removeItem = useCallback((key, useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      store.removeItem(key);
      toastService.show(
        "info",
        `Đã xóa ${key} khỏi ${useSession ? "session" : "local"} storage`,
        "Storage"
      );
    } catch (err) {
      toastService.show("error", `Không thể xóa ${key}`, "Storage Error");
    }
  }, []);

  // ✅ Clear toàn bộ storage
  const clear = useCallback((useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      store.clear();
      toastService.show(
        "warning",
        `Đã xóa toàn bộ ${useSession ? "session" : "local"} storage`,
        "Storage"
      );
    } catch (err) {
      toastService.show("error", "Không thể clear storage", "Storage Error");
    }
  }, []);

  // 🔹 Map thêm tên function cho IntegrationRunner
  const saveData = setItem;
  const getData = getItem;
  const clearData = clear;

  return (
    <StorageContext.Provider
      value={{
        setItem,
        getItem,
        removeItem,
        clear,
        saveData,
        getData,
        clearData,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);

// Tóm tắt luồng chạy của StorageContext.jsx (StatePersistenceContext)
// 1️⃣ Khởi tạo Context

// StorageContext tạo sẵn các function rỗng (setItem, getItem, removeItem, clear) làm default.

// 2️⃣ Provider chính (StorageProvider)

// Cung cấp 4 API cơ bản:

// setItem(key, value, useSession) → lưu dữ liệu vào localStorage hoặc sessionStorage.

// Nếu value là object → stringify.

// Toast báo thành công hoặc lỗi.

// getItem(key, useSession) → lấy dữ liệu.

// Auto parse JSON.

// Nếu không tồn tại hoặc parse lỗi → trả null.

// removeItem(key, useSession) → xóa 1 item.

// Toast báo info hoặc lỗi.

// clear(useSession) → xóa toàn bộ storage.

// Toast cảnh báo hoặc lỗi.

// Bổ sung alias cho IntegrationRunner:

// saveData → setItem

// getData → getItem

// clearData → clear

// 3️⃣ Hook tiện dụng

// useStorage() → trả về context để component dùng trực tiếp.

// 🔹 Luồng chạy

// Component con mount → StorageProvider wrap quanh.

// Khi gọi useStorage().setItem(...):

// Lưu dữ liệu vào storage.

// Toast báo kết quả.

// Khi gọi getItem:

// Lấy dữ liệu và parse JSON.

// Khi gọi removeItem hoặc clear:

// Xóa dữ liệu và toast báo.

// Tất cả function đều dùng useCallback để memo hóa, tránh re-render không cần thiết.
