import { useContext } from "react";
import { DataSyncContext } from "../context/modules/DataSyncContext";

export const useDataSync = () => useContext(DataSyncContext);
