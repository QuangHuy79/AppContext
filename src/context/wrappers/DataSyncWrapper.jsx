// // src/wrappers/DataSyncWrapper.jsx
// import React from "react";
// import { DataSyncProvider } from "../context/modules/DataSyncContext.jsx";

// const DataSyncWrapper = ({ children }) => {
//   return <DataSyncProvider>{children}</DataSyncProvider>;
// };

// export default DataSyncWrapper;

// ==============================

// Thay đổi DataSyncWrapper để đọc các dependency từ các Context khác
// và truyền chúng dưới dạng Props xuống DataSyncProvider.
// src/wrappers/DataSyncWrapper.jsx (Ví dụ Fix)
// import React from "react";
// import { DataSyncProvider } from "../context/modules/DataSyncContext.jsx";
// import { useAuth } from "../context/AuthContext/AuthContext"; // ⬅️ Cần import hook
// import { useNetwork } from "../context/modules/NetworkContext"; // ⬅️ Cần import hook

// const DataSyncWrapper = ({ children }) => {
//   // 1. Lấy trạng thái cần thiết từ các Context trên (dependencies)
//   const { isAuthenticated, isHydrated, token } = useAuth();
//   const { isOnline } = useNetwork();

//   // 2. Xác định điều kiện chạy sync
//   const canStartSync = isAuthenticated && isHydrated && isOnline;

//   return (
//     // 3. Truyền điều kiện và các giá trị cần thiết làm props
//     <DataSyncProvider
//       canRunSync={canStartSync}
//       authToken={token}
//       // isReady={isHydrated && isOnline} // Nếu muốn kiểm soát chi tiết hơn
//     >
//       {children}
//     </DataSyncProvider>
//   );
// };

// export default DataSyncWrapper;

// ===========================
// Dưới đây là đoạn code đã refactor và vai trò cụ thể
// của nó trong kiến trúc ứng dụng của App
// src/wrappers/DataSyncWrapper.jsx (Refactored for Flow Control)

import React, { useMemo } from "react";
import { DataSyncProvider } from "../context/modules/DataSyncContext.jsx";
import { useAuth } from "../context/AuthContext/AuthContext"; // ⬅️ Phụ thuộc: Đọc trạng thái Auth
import { useNetwork } from "../context/modules/NetworkContext"; // ⬅️ Phụ thuộc: Đọc trạng thái Network

const DataSyncWrapper = ({ children }) => {
  // 1. Lấy trạng thái dependencies cần thiết
  // 💡 isHydrated: Biến quan trọng nhất. Xác định Auth state đã load xong từ Storage chưa.
  const { isHydrated, isAuthenticated, token } = useAuth();
  const { isOnline } = useNetwork();

  // 2. Tính toán điều kiện cho phép chạy Data Sync (Memoized để tối ưu)
  const canRunSync = useMemo(() => {
    // ⭐️ Đảm bảo Data Sync chỉ chạy khi:
    // a) State Auth đã được khôi phục xong (isHydrated = true)
    // b) Đã có kết nối mạng (isOnline = true)
    // (Lưu ý: Bạn có thể thêm isAuthenticated nếu chỉ muốn sync cho user đã đăng nhập)
    return isHydrated && isOnline;
  }, [isHydrated, isOnline]);

  // 3. Truyền điều kiện và các giá trị cần thiết làm props
  return (
    <DataSyncProvider
      canRunSync={canRunSync} // ⬅️ Dùng để kích hoạt/tạm dừng logic fetch data bên trong Provider
      authToken={token} // ⬅️ Inject Token vào Provider để nó không cần gọi useAuth()
    >
      {children}
    </DataSyncProvider>
  );
};

export default DataSyncWrapper;
