import { useContext } from "react";
import { useDataContext } from "../context/modules/DataContext";

export const useData = () => {
  const context = useDataContext();
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
