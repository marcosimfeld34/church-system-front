import { createContext, useState } from "react";

import { useQueryClient } from "react-query";

import { useToast } from "@chakra-ui/react";

// services
import productService from "../services/product";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const { user, logout } = useAuthContext();
  const [products, setProducts] = useState([]);

  const toast = useToast();

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const getProducts = async (key) => {
    if (user !== null) {
      try {
        const productId = key.queryKey[1]?.id;

        const filters = key.queryKey[1]?.filters;

        const { data } = await productService.getAll({
          ...filters,
        });

        if (productId) {
          setProducts(data.filter((p) => p._id === productId));
          return data.filter((p) => p._id === productId)[0];
        }
        if (!filters) {
          setProducts(data);
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

  const handleDeleteProduct = async (product) => {
    if (user !== null) {
      try {
        await productService.delete(product._id);

        toast({
          position: "top",
          title: "Producto eliminado.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        queryClient.invalidateQueries({ queryKey: ["products"] });
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
    <ProductContext.Provider
      value={{
        products,
        getProducts,
        handleDeleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
