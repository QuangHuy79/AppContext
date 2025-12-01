// src/runtime/clusters/UICluster.jsx
import React from "react";
import { UIProvider } from "../../context/modules/UIContext";
import { SettingsProvider } from "../../context/modules/SettingsContext";
import ToastProvider from "../../components/Toast/ToastProvider";

export default function UICluster({ children }) {
  return (
    <UIProvider>
      <SettingsProvider>
        <ToastProvider>{children}</ToastProvider>
      </SettingsProvider>
    </UIProvider>
  );
}
