import { createContext, useState } from "react";

import { useQueryClient } from "react-query";

import { useToast } from "@chakra-ui/react";

// services
import saleService from "../services/sale";
import productService from "../services/product";
import saleDetailService from "../services/saleDetails";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";
import debtService from "../services/debt";

export const SaleContext = createContext();

export const SaleContextProvider = ({ children }) => {
  const { user, logout } = useAuthContext();
  const [sales, setSales] = useState([]);

  const toast = useToast();

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const getSales = async (key) => {
    if (user !== null) {
      try {
        const saleId = key.queryKey[1]?.id;

        const filters = key.queryKey[1]?.filters;

        const { data } = await saleService.getAll({
          ...filters,
        });

        if (saleId) {
          setSales(data.filter((s) => s._id === saleId));
          return data.filter((s) => s._id === saleId)[0];
        }
        if (!filters) {
          setSales(data);
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

  const handleDeleteSale = async (sale, saleDetails, debt) => {
    if (user !== null) {
      try {
        const productsToUpdate = [];
        saleDetails.forEach((saleDetail) => {
          productsToUpdate.push(saleDetail.product);
        });

        saleDetails.forEach((saleDetail) => {
          productsToUpdate.forEach((productToUpdate) => {
            if (saleDetail.product._id === productToUpdate._id) {
              productToUpdate.stock =
                productToUpdate.stock + saleDetail.quantity;
            }
          });
        });

        const uniqByKeepLast = (data, key) => {
          return [...new Map(data.map((x) => [key(x), x])).values()];
        };

        let products = [];

        productsToUpdate.forEach((productToUpdate) => {
          products.push({
            id: productToUpdate._id,
            stock: productToUpdate.stock,
          });
        });

        products = uniqByKeepLast(products, (it) => it.id);

        await productService.updateMany({ products });

        await saleService.delete(sale._id);

        await saleDetailService.deleteMany({
          saleDetails: saleDetails.map((saleDetail) => saleDetail._id),
        });

        if (debt) {
          await debtService.delete(debt._id);

          toast({
            position: "top",
            title: "Deuda eliminada",
            status: "error",
            duration: 3000,
            isClosable: true,
          });

          queryClient.invalidateQueries({ queryKey: ["debts"] });
        }

        toast({
          position: "top",
          title: "Venta eliminada.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["saleDetails"] });
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
    <SaleContext.Provider
      value={{
        sales,
        getSales,
        handleDeleteSale,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};
