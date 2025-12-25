// src/runtime/RuntimeGuard.jsx
import { useEffect, useRef } from "react";
import { useRuntimeSnapshot } from "./useRuntimeSnapshot";

/**
 * RuntimeGuard
 * STEP 13–14
 *
 * Nhiệm vụ:
 * - Lấy snapshot DUY NHẤT từ RuntimeSnapshotProvider
 * - Chạy các guard theo thứ tự roadmap
 * - Chỉ chạy 1 lần (StrictMode safe)
 * - KHÔNG tạo state
 * - KHÔNG render UI
 */

export default function RuntimeGuard() {
  // ✅ NGUỒN SNAPSHOT DUY NHẤT
  const snapshot = useRuntimeSnapshot();

  // ✅ đảm bảo chỉ chạy 1 lần
  const ranRef = useRef(false);

  useEffect(() => {
    // snapshot chưa sẵn → không làm gì
    if (!snapshot) return;

    // đã chạy rồi → bỏ qua (StrictMode)
    if (ranRef.current) return;
    ranRef.current = true;

    let failed = false;

    console.group("🛡️ RuntimeGuard");

    /* -------------------------------------------------
       STEP 13 – Guard Network
    -------------------------------------------------- */
    if (typeof snapshot.network?.isOnline !== "boolean") {
      console.error(
        "[RG-NET-01] network.isOnline expected boolean",
        snapshot.network?.isOnline
      );
      failed = true;
    }

    /* -------------------------------------------------
       STEP 14 – Guard Device
    -------------------------------------------------- */
    const device = snapshot.device;

    if (!device) {
      console.error("[RG-DEV-01] device snapshot missing");
      failed = true;
    } else {
      if (typeof device.width !== "number") {
        console.error("[RG-DEV-02] device.width invalid", device.width);
        failed = true;
      }

      if (typeof device.height !== "number") {
        console.error("[RG-DEV-03] device.height invalid", device.height);
        failed = true;
      }

      if (typeof device.isMobile !== "boolean") {
        console.error(
          "[RG-DEV-04] device.isMobile expected boolean",
          device.isMobile
        );
        failed = true;
      }
    }

    /* -------------------------------------------------
       RESULT
    -------------------------------------------------- */
    if (failed) {
      console.error("🛑 [RUNTIME GUARD] FAILED");
    } else {
      console.log("🟢 [RUNTIME GUARD] PASSED");
    }

    console.groupEnd();
  }, [snapshot]);

  // Guard KHÔNG render gì
  return null;
}
