// src/wrappers/DataSyncWrapper.jsx
import React from "react";
import { DataSyncProvider } from "../context/modules/DataSyncContext.jsx";

const DataSyncWrapper = ({ children }) => {
  return <DataSyncProvider>{children}</DataSyncProvider>;
};

export default DataSyncWrapper;
