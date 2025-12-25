// src/runtime/guards/ui.guard.js

export function guardUI(snapshot) {
  if (!snapshot || !snapshot.ui) {
    console.error("🛑 [RG-UI-01] Missing ui snapshot");
    return false;
  }

  const { ready } = snapshot.ui;

  if (typeof ready !== "boolean") {
    console.error("🛑 [RG-UI-02] ui.ready expected boolean", ready);
    return false;
  }

  return true;
}
