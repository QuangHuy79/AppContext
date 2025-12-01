import { useContext } from "react";
import { StorageContext } from "../context/modules/StorageContext";

export const useStorage = () => useContext(StorageContext);
