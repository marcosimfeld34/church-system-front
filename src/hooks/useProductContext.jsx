import { useContext } from "react";

import { ProductContext } from "../context/ProductContext";

export function useProductContext() {
  return useContext(ProductContext);
}
