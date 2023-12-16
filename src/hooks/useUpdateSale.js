import { useMutation, useQueryClient } from "@tanstack/react-query";

import saleService from "../services/sale";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: updateSale } = useMutation({
    mutationFn: ({ saleId, saleToUpdate }) => {
      return saleService.update(saleId, saleToUpdate, axiosPrivate);
    },
    onMutate: async (saleToUpdate) => {
      queryClient.cancelQueries(["sales"]);

      const previousSales = queryClient.getQueryData(["sales"]);

      queryClient.setQueryData(["sales"], (oldData) => {
        if (oldData == null) return [saleToUpdate];
        return [saleToUpdate, ...oldData];
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

  return { updateSale };
};
