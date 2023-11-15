import { useContext } from "react";

import { ClientContext } from "../context/ClientContext";

export function useClientContext() {
  return useContext(ClientContext);
}
