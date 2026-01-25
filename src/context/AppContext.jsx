// src/context/AppContext.jsx
import React, {
  createContext,
  useReducer,
  useRef,
  useContext,
  useEffect,
} from "react";

import { appReducer } from "./reducers/appReducer";
import { initialAppState } from "./initialState";
import ToastProvider from "../components/Toast/ToastProvider";

// MODULE PROVIDERS
import { NetworkProvider } from "./modules/NetworkContext";
import { DeviceProvider } from "./modules/DeviceContext";
import { SettingsProvider } from "./modules/SettingsContext";
import { UIProvider } from "./modules/UIContext";
import { AuthProvider } from "./AuthContext/AuthContext";
import { DataProvider } from "./modules/DataContext";
import { DataSyncProvider } from "./modules/DataSyncContext";
import { APIProvider } from "./APIContext/APIContext";
import { CacheProvider } from "./modules/CacheContext";
import { StorageProvider } from "./modules/StorageContext";

// MODULE HOOKS
import { useNetwork } from "../hooks/useNetwork";
import { useDevice } from "../hooks/useDevice";
import { useSettings } from "../hooks/useSettings";

/* ============================================================
   APP CONTEXT — CONTRACT GIỮ NGUYÊN
============================================================ */

export const AppContext = createContext({
  state: initialAppState,
  dispatch: () => {},
});

/* ============================================================
   PROVIDER COMPOSITION
============================================================ */

export const AppProvider = ({ children }) => {
  return (
    <ToastProvider>
      <SettingsProvider>
        <NetworkProvider>
          <DeviceProvider>
            <UIProvider>
              <CacheProvider>
                <StorageProvider>
                  <APIProvider>
                    <AuthProvider>
                      <DataProvider>
                        <DataSyncProvider>
                          <AppProviderInner>{children}</AppProviderInner>
                        </DataSyncProvider>
                      </DataProvider>
                    </AuthProvider>
                  </APIProvider>
                </StorageProvider>
              </CacheProvider>
            </UIProvider>
          </DeviceProvider>
        </NetworkProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};

/* ============================================================
   CORE LOGIC (STATE HUB ONLY)
============================================================ */

const AppProviderInner = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // 🔒 STABLE CONTEXT VALUE
  const ctxRef = useRef({ state, dispatch });
  ctxRef.current.state = state;
  ctxRef.current.dispatch = dispatch;

  // module hooks (READ-ONLY SIGNALS)
  const { isOnline } = useNetwork();
  const { deviceInfo } = useDevice();
  const { theme, locale } = useSettings();

  /* -----------------------------
     DERIVED STATE SYNC (TEMP – Phase 3.7 OK)
  ------------------------------ */

  useEffect(() => {
    dispatch({ type: "NETWORK/SET_ONLINE", payload: isOnline });
  }, [isOnline]);

  useEffect(() => {
    if (deviceInfo) {
      dispatch({ type: "DEVICE/SET_INFO", payload: deviceInfo });
    }
  }, [deviceInfo]);

  useEffect(() => {
    dispatch({
      type: "SETTINGS/INIT",
      payload: { theme, locale },
    });
  }, [theme, locale]);

  return (
    <AppContext.Provider value={ctxRef.current}>{children}</AppContext.Provider>
  );
};

/* ============================================================
   HOOKS — EXPORT GIỮ NGUYÊN
============================================================ */

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
};

export const useAppState = () => useApp().state;
export const useAppDispatch = () => useApp().dispatch;
