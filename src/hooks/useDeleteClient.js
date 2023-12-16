import { useMutation, useQueryClient } from "@tanstack/react-query";

import clientService from "../services/client";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: deleteClient } = useMutation({
    mutationFn: ({ clientId }) => {
      return clientService.delete(clientId, axiosPrivate);
    },
    onMutate: async (clientToDelete) => {
      queryClient.cancelQueries(["clients"]);

      const previousClients = queryClient.getQueryData(["clients"]);

      queryClient.setQueryData(["clients"], (oldData) => {
        if (oldData == null) return [];
        return [...oldData.filter((c) => c._id !== clientToDelete._id)];
      });

      return { previousClients };
    },
    onError: (error, variables, context) => {
      if (context?.previousClients != null) {
        queryClient.setQueryData(["clients"], context.previousClients);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["clients"]);
    },
  });

  return { deleteClient };
};
