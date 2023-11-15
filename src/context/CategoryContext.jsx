import { createContext, useState } from "react";

import { useQueryClient } from "react-query";

import { useToast } from "@chakra-ui/react";

// services
import categoryService from "../services/category";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

export const CategoryContext = createContext();

export const CategoryContextProvider = ({ children }) => {
  const { user, logout } = useAuthContext();
  const [categories, setCategories] = useState([]);

  const toast = useToast();

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const getCategories = async (key) => {
    if (user !== null) {
      try {
        const categoryId = key.queryKey[1]?.id;

        const filters = key.queryKey[1]?.filters;

        const { data } = await categoryService.getAll({
          ...filters,
        });

        if (categoryId) {
          setCategories(data.filter((c) => c._id === categoryId));
          return data.filter((c) => c._id === categoryId)[0];
        }
        if (!filters) {
          setCategories(data);
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

  const handleDeleteCategory = async (category) => {
    if (user !== null) {
      try {
        await categoryService.delete(category._id);

        toast({
          position: "top",
          title: "Categoria eliminada.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        queryClient.invalidateQueries({ queryKey: ["categories"] });
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
    <CategoryContext.Provider
      value={{
        categories,
        getCategories,
        handleDeleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
