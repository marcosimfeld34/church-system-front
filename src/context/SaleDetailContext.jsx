import { createContext, useState } from "react";

// services
import saleDetailService from "../services/saleDetails";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

export const SaleDetailContext = createContext();

export const SaleDetailContextProvider = ({ children }) => {
  const { user, logout } = useAuthContext();
  const [saleDetails, setSaleDetails] = useState([]);

  const getSaleDetails = async (key) => {
    if (user !== null) {
      try {
        const saleId = key.queryKey[1]?.saleId;

        const filters = key.queryKey[1]?.filters;
        const { data } = await saleDetailService.getAll({
          ...filters,
        });
        if (saleId) {
          setSaleDetails(data.filter((s) => s.sale === saleId));
          return data.filter((s) => s.sale === saleId);
        }
        if (!filters) {
          setSaleDetails(data);
        }
        return data;
      } catch (err) {
        if (
          err.response.data.status === 400 &&
          err.response.data.message === "INVALID_TOKEN"
        ) {
          logout();
        }
      }
    }
  };

  return (
    <SaleDetailContext.Provider
      value={{
        saleDetails,
        getSaleDetails,
      }}
    >
      {children}
    </SaleDetailContext.Provider>
  );
};
