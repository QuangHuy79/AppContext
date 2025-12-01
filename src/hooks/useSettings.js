import { useContext } from "react";
import { SettingsContext } from "../context/modules/SettingsContext";

export const useSettings = () => {
  return useContext(SettingsContext);
};
