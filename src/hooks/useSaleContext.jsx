import { useContext } from "react";

import { SaleContext } from "../context/SaleContext";

export function useSaleContext() {
  return useContext(SaleContext);
}
