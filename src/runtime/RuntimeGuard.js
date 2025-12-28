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

export function RuntimeGuard() {
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
   STEP 15 – Guard Settings
-------------------------------------------------- */
    const settings = snapshot.settings;

    if (!settings) {
      console.error("[RG-SET-01] settings snapshot missing");
      failed = true;
    } else {
      if (typeof settings.theme !== "string") {
        console.error(
          "[RG-SET-02] settings.theme expected string",
          settings.theme
        );
        failed = true;
      }

      if (typeof settings.locale !== "string") {
        console.error(
          "[RG-SET-03] settings.locale expected string",
          settings.locale
        );
        failed = true;
      }
    }
    /* -------------------------------------------------
   STEP 16 – Guard UI
-------------------------------------------------- */
    const ui = snapshot.ui;

    if (!ui) {
      console.error("[RG-UI-01] ui snapshot missing");
      failed = true;
    } else {
      if (typeof ui.loading !== "boolean") {
        console.error("[RG-UI-02] ui.loading expected boolean", ui.loading);
        failed = true;
      }
    }
    /* -------------------------------------------------
   STEP 17 – Guard Auth
-------------------------------------------------- */
    const auth = snapshot.auth;

    if (!auth) {
      console.error("[RG-AUTH-01] auth snapshot missing");
      failed = true;
    } else {
      if (typeof auth.isAuthenticated !== "boolean") {
        console.error(
          "[RG-AUTH-02] auth.isAuthenticated expected boolean",
          auth.isAuthenticated
        );
        failed = true;
      }
    }
    /* -------------------------------------------------
   STEP 18 – Guard Data
-------------------------------------------------- */
    const data = snapshot.data;

    if (!data) {
      console.error("[RG-DATA-01] data snapshot missing");
      failed = true;
    } else {
      if (typeof data.count !== "number") {
        console.error("[RG-DATA-02] data.count expected number", data.count);
        failed = true;
      }
    }

    /* -------------------------------------------------
       RESULT
    -------------------------------------------------- */
    if (failed) {
      console.error("🛑 [RUNTIME GUARD] FAILED");

      // if (import.meta.env.DEV) {
      //   // ❌ DEV: fail fast, dừng runtime
      //   throw new Error("[RUNTIME GUARD] Snapshot invalid — runtime halted");
      // }
      if (failed) {
        console.error("🛑 [RUNTIME GUARD] FAILED");

        if (import.meta.env.DEV) {
          throw new Error(
            "[RUNTIME GUARD] Snapshot invalid — runtime halted (DEV)"
          );
        } else {
          // PROD: không crash app
          console.error(
            "[RUNTIME GUARD] Snapshot invalid — app continues in safe mode"
          );
        }
      }
      // ⚠️ PROD: không throw, app tiếp tục chạy
      return;
    } else {
      console.log("🟢 [RUNTIME GUARD] PASSED");
    }

    console.groupEnd();
  }, [snapshot]);

  // Guard KHÔNG render gì
  return null;
}
