import { useQuery } from "@tanstack/react-query";

import productService from "../services/product";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useProducts = () => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await productService.getAll({}, axiosPrivate);
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
