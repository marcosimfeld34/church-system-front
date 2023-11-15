import { useContext } from "react";

import { SaleDetailContext } from "../context/SaleDetailContext";

export function useSaleDetailContext() {
  return useContext(SaleDetailContext);
}
