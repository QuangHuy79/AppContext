import { useContext } from "react";
import { NetworkContext } from "../context/modules/NetworkContext";

export const useNetwork = () => {
  return useContext(NetworkContext);
};
