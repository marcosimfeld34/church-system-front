import { useQuery } from "@tanstack/react-query";

import debtService from "../services/debt";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDebts = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = props || "";

  const query = useQuery({
    queryKey: [
      "debts",
      {
        filters: { id },
      },
    ],
    queryFn: async (key) => {
      const filters = key?.queryKey[1]?.filters;
      const { data } = await debtService.getAll({ ...filters }, axiosPrivate);
      return data;
    },
  });

  return query;
};
