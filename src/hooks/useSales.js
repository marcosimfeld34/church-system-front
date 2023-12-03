import { useQuery } from "@tanstack/react-query";

import saleService from "../services/sale";

export const useSales = () => {
  const query = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data } = await saleService.getAll({});
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 0,
    staleTime: Infinity,
  });

  return query;
};
