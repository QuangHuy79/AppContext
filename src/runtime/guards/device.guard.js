/// / Phiên bản đúng kiến trúc (OBS-07 compliant)
// import { emitError } from "../../obs/errorSink";

// export function guardDevice(snapshot) {
//   const device = snapshot?.device;

//   if (!device) {
//     emitError({
//       source: "RG-DEV-01",
//       message: "snapshot.device is missing",
//       snapshot,
//     });
//     return false;
//   }

//   if (typeof device.userAgent !== "string") {
//     emitError({
//       source: "RG-DEV-02",
//       message: "device.userAgent expected string",
//       snapshot,
//     });
//     return false;
//   }

//   if (typeof device.platform !== "string") {
//     emitError({
//       source: "RG-DEV-03",
//       message: "device.platform expected string",
//       snapshot,
//     });
//     return false;
//   }

//   if (device.memory !== null && typeof device.memory !== "number") {
//     emitError({
//       source: "RG-DEV-04",
//       message: "device.memory expected number | null",
//       snapshot,
//     });
//     return false;
//   }

//   return true;
// }

// =====================================
// src/runtime/guards/device.guard.js (FINAL – đã dọn rác)
// src/runtime/guards/device.guard.js

// export function guardDevice(snapshot) {
//   const device = snapshot?.device;

//   if (!device) {
//     return false;
//   }

//   if (typeof device.userAgent !== "string") {
//     return false;
//   }

//   if (typeof device.platform !== "string") {
//     return false;
//   }

//   if (device.memory !== null && typeof device.memory !== "number") {
//     return false;
//   }

//   return true;
// }

// ===========================================
// File device.guard.js — BẢN FINAL
// src/runtime/guards/device.guard.js
import { emitError } from "../../obs/errorSink";

export function guardDevice(snapshot) {
  const device = snapshot?.device;

  if (!device) {
    emitError({
      source: "RG-DEV-01",
      message: "snapshot.device is missing",
      snapshot,
    });
    return false;
  }

  if (typeof device.userAgent !== "string") {
    emitError({
      source: "RG-DEV-02",
      message: "device.userAgent expected string",
      snapshot,
    });
    return false;
  }

  if (typeof device.platform !== "string") {
    emitError({
      source: "RG-DEV-03",
      message: "device.platform expected string",
      snapshot,
    });
    return false;
  }

  if (device.memory !== null && typeof device.memory !== "number") {
    emitError({
      source: "RG-DEV-04",
      message: "device.memory expected number | null",
      snapshot,
    });
    return false;
  }

  if (typeof device.width !== "number") {
    emitError({
      source: "RG-DEV-05",
      message: "device.width expected number",
      snapshot,
    });
    return false;
  }

  if (typeof device.height !== "number") {
    emitError({
      source: "RG-DEV-06",
      message: "device.height expected number",
      snapshot,
    });
    return false;
  }

  if (typeof device.isMobile !== "boolean") {
    emitError({
      source: "RG-DEV-07",
      message: "device.isMobile expected boolean",
      snapshot,
    });
    return false;
  }

  if (typeof device.isTablet !== "boolean") {
    emitError({
      source: "RG-DEV-08",
      message: "device.isTablet expected boolean",
      snapshot,
    });
    return false;
  }

  if (typeof device.isDesktop !== "boolean") {
    emitError({
      source: "RG-DEV-09",
      message: "device.isDesktop expected boolean",
      snapshot,
    });
    return false;
  }

  return true;
}
