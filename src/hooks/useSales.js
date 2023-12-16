import { useQuery } from "@tanstack/react-query";

import saleService from "../services/sale";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useSales = () => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data } = await saleService.getAll({}, axiosPrivate);
      return data;
    },
  });

  return query;
};
