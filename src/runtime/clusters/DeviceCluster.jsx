// src/runtime/clusters/DeviceCluster.jsx
import React from "react";
import { DeviceProvider } from "../../context/modules/DeviceContext";

export default function DeviceCluster({ children }) {
  return <DeviceProvider>{children}</DeviceProvider>;
}
