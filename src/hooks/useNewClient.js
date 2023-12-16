import { useMutation, useQueryClient } from "@tanstack/react-query";

import clientService from "../services/client";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useNewClient = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: addNewClient } = useMutation({
    mutationFn: (newClient) => clientService.store(newClient, axiosPrivate),
    onMutate: async (newClient) => {
      queryClient.cancelQueries(["clients"]);

      const previousClient = queryClient.getQueryData(["clients"]);

      queryClient.setQueryData(["clients"], (oldData) => {
        if (oldData == null) return [newClient];
        return [newClient, ...oldData];
      });

      return { previousClient };
    },
    onError: (error, variables, context) => {
      if (context?.previousClient != null) {
        queryClient.setQueryData(["clients"], context.previousClient);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["clients"]);
    },
  });

  return { addNewClient };
};
