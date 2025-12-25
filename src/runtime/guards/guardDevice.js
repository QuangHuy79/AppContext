// src/runtime/guards/guardDevice.js

export function guardDevice(snapshot) {
  if (!snapshot?.device) {
    console.error("🛑 [RG-DEV-00] device snapshot missing");
    return false;
  }

  const { width, height, isMobile, isTablet, isDesktop } = snapshot.device;

  if (typeof width !== "number" || typeof height !== "number") {
    console.error("🛑 [RG-DEV-01] width/height must be number", {
      width,
      height,
    });
    return false;
  }

  if (
    typeof isMobile !== "boolean" ||
    typeof isTablet !== "boolean" ||
    typeof isDesktop !== "boolean"
  ) {
    console.error("🛑 [RG-DEV-02] device flags must be boolean", {
      isMobile,
      isTablet,
      isDesktop,
    });
    return false;
  }

  return true;
}
