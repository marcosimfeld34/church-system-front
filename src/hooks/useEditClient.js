import { useMutation, useQueryClient } from "@tanstack/react-query";

import clientService from "../services/client";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useEditClient = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: editClient } = useMutation({
    mutationFn: ({ clientId, clientToUpdate }) =>
      clientService.update(clientId, clientToUpdate, axiosPrivate),
    onMutate: async (clientToUpdate) => {
      queryClient.cancelQueries(["clients"]);

      const previousClient = queryClient.getQueryData(["clients"]);

      queryClient.setQueryData(["clients"], (oldData) => {
        if (oldData == null) return [clientToUpdate];
        return [clientToUpdate, ...oldData];
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

  return { editClient };
};
