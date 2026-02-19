import { useContext } from "react";
import { APIContext } from "../context/modules/APIContext";

export function useAPI() {
  return useContext(APIContext);
}
