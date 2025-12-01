import { useContext } from "react";
import { DeviceContext } from "../context/modules/DeviceContext";

export const useDevice = () => {
  return useContext(DeviceContext);
};
