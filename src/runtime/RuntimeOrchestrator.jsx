// FILE FULL — RuntimeOrchestrator.jsx (FIXED — PHASE 3.3 PASS)
// src/runtime/RuntimeOrchestrator.jsx
import { useEffect } from "react";
import { RuntimeSnapshotProvider } from "./useRuntimeSnapshot";

import { useNetwork } from "../context/modules/NetworkContext";
import { useDevice } from "../context/modules/DeviceContext";
import { useSettings } from "../context/modules/SettingsContext";
import { useUI } from "../context/modules/UIContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useDataActions } from "../context/modules/DataContext";
import { useDataSync } from "../context/modules/DataSyncContext";

export default function RuntimeOrchestrator({ children }) {
  /* -----------------------------
     SYSTEM SIGNALS
  ------------------------------ */
  const network = useNetwork();
  const device = useDevice();
  const settings = useSettings();
  const auth = useAuth();

  /* -----------------------------
     UI SIGNAL (COARSE)
  ------------------------------ */
  const ui = useUI();

  /* -----------------------------
     DATA LAYER (ACTIONS ONLY)
  ------------------------------ */
  const { loadData } = useDataActions();

  /* -----------------------------
     SYNC SIGNAL
  ------------------------------ */
  const sync = useDataSync();

  /* -----------------------------
     Boot orchestration
  ------------------------------ */
  useEffect(() => {
    if (auth?.isAuthenticated && network?.isOnline) {
      loadData();
    }
  }, [auth?.isAuthenticated, network?.isOnline, loadData]);

  const d = device?.deviceInfo;

  /* -----------------------------
     RUNTIME SNAPSHOT
  ------------------------------ */
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
      ready: Boolean(auth?.isAuthenticated),
    },

    sync: {
      running: Boolean(sync?.syncing),
    },
  };

  return (
    <RuntimeSnapshotProvider value={snapshot}>
      {children}
    </RuntimeSnapshotProvider>
  );
}
