// src/wrappers/DataWrapper.jsx
import React from "react";
import { DataProvider } from "../contexts/DataContext/DataContext.jsx";

const DataWrapper = ({ children }) => {
  return <DataProvider>{children}</DataProvider>;
};

export default DataWrapper;
