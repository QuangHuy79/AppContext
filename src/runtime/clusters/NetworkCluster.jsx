// src/runtime/clusters/NetworkCluster.jsx
import React from "react";
import { NetworkProvider } from "../../context/modules/NetworkContext";

export default function NetworkCluster({ children }) {
  return <NetworkProvider>{children}</NetworkProvider>;
}
