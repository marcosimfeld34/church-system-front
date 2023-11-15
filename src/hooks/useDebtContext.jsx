import { useContext } from "react";

import { DebtContext } from "../context/DebtContext";

export function useDebtContext() {
  return useContext(DebtContext);
}
