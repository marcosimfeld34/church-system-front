import { useQuery } from "@tanstack/react-query";

import productService from "../services/product";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useProducts = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = props || "";

  const query = useQuery({
    queryKey: [
      "products",
      {
        filters: { id },
      },
    ],
    queryFn: async (key) => {
      const filters = key?.queryKey[1]?.filters;
      const { data } = await productService.getAll(
        { ...filters },
        axiosPrivate
      );
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
