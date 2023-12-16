import { useQuery } from "@tanstack/react-query";

import categoryService from "../services/category";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useCategories = () => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await categoryService.getAll({}, axiosPrivate);
      return data;
    },
  });

  return query;
};
