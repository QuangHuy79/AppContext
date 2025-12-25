// src/runtime/guards/device.guard.js

/**
 * Device Runtime Guard – STEP 13
 * - Chỉ validate snapshot.device
 * - Không mutate
 * - Không throw
 * - Chỉ log lỗi
 */

export function guardDevice(snapshot) {
  const device = snapshot?.device;

  if (!device) {
    console.error("🛑 [RG-DEV-01] snapshot.device is missing");
    return false;
  }

  const errors = [];

  if (typeof device.width !== "number") {
    errors.push("device.width expected number");
  }

  if (typeof device.height !== "number") {
    errors.push("device.height expected number");
  }

  if (typeof device.isMobile !== "boolean") {
    errors.push("device.isMobile expected boolean");
  }

  if (typeof device.isTablet !== "boolean") {
    errors.push("device.isTablet expected boolean");
  }

  if (typeof device.isDesktop !== "boolean") {
    errors.push("device.isDesktop expected boolean");
  }

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`🛑 [RG-DEV-02] ${e}`, device));
    return false;
  }

  return true;
}
