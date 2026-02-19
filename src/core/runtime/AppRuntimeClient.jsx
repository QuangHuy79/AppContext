// src/runtime/AppRuntimeClient.jsx
import React, { useEffect, useRef } from "react";

import { AppProvider } from "../context/AppContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";
import RuntimeOrchestrator from "./RuntimeOrchestrator";
import ErrorBoundary from "../obs/ErrorBoundary";
import UIHostRouter from "./UIHostRouter";

// 🔒 DOMAIN HOST
import { registerDomain } from "../../domainHost/domainHost";

// Domains
// import cartDomain from "../core/domains/cart";
import cartDomain from "../../core/features/commerce/cart";
import productDomain from "../../core/features/commerce/product";
import orderDomain from "../../core/features/commerce/order";
import inventoryDomain from "../../core/features/commerce/inventory";
import profileDomain from "../../core/features/account/profile";

const AppRuntimeClient = () => {
  // ✅ Prevent double registration (React StrictMode safe)
  const didRegister = useRef(false);

  useEffect(() => {
    if (didRegister.current) return;

    registerDomain(cartDomain);
    registerDomain(productDomain);
    registerDomain(orderDomain);
    registerDomain(inventoryDomain);
    registerDomain(profileDomain);

    didRegister.current = true;
  }, []);

  return (
    <ErrorBoundary>
      <StatePersistenceProvider persistKey="APP_STATE" version={2}>
        <AppProvider>
          <RuntimeOrchestrator>
            {/* 🌐 WEB UI HOST */}
            <UIHostRouter hostKey="web" />
          </RuntimeOrchestrator>
        </AppProvider>
      </StatePersistenceProvider>
    </ErrorBoundary>
  );
};

export default AppRuntimeClient;
