import { createContext, useState } from "react";

import { useToast } from "@chakra-ui/react";

import { useQueryClient } from "react-query";

// services
import debtService from "../services/debt";
import saleService from "../services/sale";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

export const DebtContext = createContext();

export const DebtContextProvider = ({ children }) => {
  const { user, logout } = useAuthContext();
  const [debts, setDebts] = useState([]);

  const toast = useToast();

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const getDebts = async (key) => {
    if (user !== null) {
      try {
        const debtId = key.queryKey[1]?.id;

        const filters = key.queryKey[1]?.filters;

        const { data } = await debtService.getAll({
          ...filters,
        });

        if (debtId) {
          setDebts(data.filter((c) => c._id === debtId));
          return data.filter((c) => c._id === debtId)[0];
        }
        if (!filters) {
          setDebts(data);
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

  const handlePaid = async (debt) => {
    if (user !== null) {
      try {
        let debtUpdated = {
          ...debt,
        };

        debtUpdated.deliveredAmount = debt.initialAmount;

        let saleToUpdate = {
          ...debt.sale,
        };
        saleToUpdate.isPaid = true;
        await saleService.update(saleToUpdate._id, saleToUpdate);

        debtUpdated.isPaid = true;

        await debtService.update(debtUpdated._id, debtUpdated);

        toast({
          position: "top",
          title: "Pago total realizado.",
          status: "success",
          colorScheme: "purple",
          duration: 3000,
          isClosable: true,
        });

        queryClient.invalidateQueries({ queryKey: ["debts"] });
      } catch (error) {
        if (
          error.response.data.status === 400 &&
          error.response.data.message === "INVALID_TOKEN"
        ) {
          logout();
        }
      }
    }
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        getDebts,
        handlePaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
