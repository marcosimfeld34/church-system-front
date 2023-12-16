import { useMutation, useQueryClient } from "@tanstack/react-query";

import saleService from "../services/sale";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useNewSale = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: addNewSale } = useMutation({
    mutationFn: (newSale) => saleService.store(newSale, axiosPrivate),
    onMutate: async (newSale) => {
      queryClient.cancelQueries(["sales"]);

      const previousSales = queryClient.getQueryData(["sales"]);

      queryClient.setQueryData(["sales"], (oldData) => {
        if (oldData == null) return [newSale];
        return [newSale, ...oldData];
      });

      return { previousSales };
    },
    onError: (error, variables, context) => {
      if (context?.previousSales != null) {
        queryClient.setQueryData(["sales"], context.previousSales);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["sales"]);
    },
  });

  return { addNewSale };
};
