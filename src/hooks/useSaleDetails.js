import { useQuery } from "@tanstack/react-query";

import saleDetailService from "../services/saleDetails";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useSaleDetails = () => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: ["saleDetails"],
    queryFn: async () => {
      const { data } = await saleDetailService.getAll({}, axiosPrivate);
      return data;
    },
  });

  return query;
};
