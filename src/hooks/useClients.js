import { useQuery } from "@tanstack/react-query";

import clientService from "../services/client";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useClients = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = props || "";

  const query = useQuery({
    queryKey: [
      "clients",
      {
        filters: { id },
      },
    ],
    queryFn: async (key) => {
      const filters = key?.queryKey[1]?.filters;
      const { data } = await clientService.getAll({ ...filters }, axiosPrivate);
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
