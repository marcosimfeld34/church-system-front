import { useQuery } from "@tanstack/react-query";

import methodPaymentService from "../services/methodPayments";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useMethodPayments = () => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: ["methodPayments"],
    queryFn: async () => {
      const { data } = await methodPaymentService.getAll({}, axiosPrivate);
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
