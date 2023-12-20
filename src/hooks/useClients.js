import { useQuery } from "@tanstack/react-query";

import clientService from "../services/client";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useClients = () => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await clientService.getAll({}, axiosPrivate);
      return data;
    },
    staleTime: Infinity,
  });

  return query;
};
