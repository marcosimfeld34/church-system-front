import { useQuery } from "@tanstack/react-query";

import categoryService from "../services/category";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useCategories = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = props || "";

  const query = useQuery({
    queryKey: [
      "categories",
      {
        filters: { id },
      },
    ],
    queryFn: async (key) => {
      const filters = key?.queryKey[1]?.filters;
      const { data } = await categoryService.getAll(
        { ...filters },
        axiosPrivate
      );
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
