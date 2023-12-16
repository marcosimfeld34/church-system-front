import { useQuery } from "@tanstack/react-query";

import debtService from "../services/debt";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDebts = () => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
      const { data } = await debtService.getAll({}, axiosPrivate);
      return data;
    },
  });

  return query;
};
