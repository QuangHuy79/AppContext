// src/runtime/RuntimeOrchestrator.jsx
import { RuntimeSnapshotProvider } from "./useRuntimeSnapshot";
import { useNetwork } from "../context/modules/NetworkContext";
import { useDevice } from "../context/modules/DeviceContext";
import { useSettings } from "../context/modules/SettingsContext";
import { useUI } from "../context/modules/UIContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useData } from "../context/modules/DataContext";
import { useDataSync } from "../context/modules/DataSyncContext";
import { RuntimeGuard } from "./RuntimeGuard";

export default function RuntimeOrchestrator({ children }) {
  const network = useNetwork();
  const device = useDevice(); // { deviceInfo }
  const settings = useSettings();
  const ui = useUI();
  const auth = useAuth();
  const data = useData();
  const sync = useDataSync();

  const d = device?.deviceInfo;

  const snapshot = {
    network: {
      isOnline: Boolean(network?.isOnline),
    },

    device: {
      width: Number(d?.width ?? 0),
      height: Number(d?.height ?? 0),
      isMobile: Boolean(d?.isMobile),
      isTablet: Boolean(d?.isTablet),
      isDesktop: Boolean(d?.isDesktop),
    },

    settings: {
      theme: settings?.theme ?? "light",
      locale: settings?.locale ?? "en",
    },

    ui: {
      loading: Boolean(ui?.loading),
    },

    auth: {
      isAuthenticated: Boolean(auth?.isAuthenticated),
    },

    data: {
      count: Array.isArray(data?.items) ? data.items.length : 0,
    },

    sync: {
      running: Boolean(sync?.syncing),
    },
  };
  if (import.meta.env.DEV) {
    Object.freeze(snapshot);
    Object.values(snapshot).forEach((v) => {
      if (v && typeof v === "object") Object.freeze(v);
    });
  }

  return (
    <RuntimeSnapshotProvider value={snapshot}>
      {import.meta.env.DEV && <RuntimeGuard />}
      {children}
    </RuntimeSnapshotProvider>
  );
}
