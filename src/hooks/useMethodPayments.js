import { useQuery } from "@tanstack/react-query";

import methodPaymentService from "../services/methodPayments";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useMethodPayments = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = props || "";

  const query = useQuery({
    queryKey: [
      "methodPayments",
      {
        filters: { id },
      },
    ],
    queryFn: async (key) => {
      const filters = key?.queryKey[1]?.filters;
      const { data } = await methodPaymentService.getAll(
        { ...filters },
        axiosPrivate
      );
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
