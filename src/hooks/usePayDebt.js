import { useMutation, useQueryClient } from "@tanstack/react-query";

import debtService from "../services/debt";
import saleService from "../services/sale";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const usePayDebt = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: payDebt } = useMutation({
    mutationFn: async ({ debtToUpdate }) => {
      let debtUpdated = {
        ...debtToUpdate,
      };

      debtUpdated.deliveredAmount = debtToUpdate.initialAmount;

      let saleToUpdate = {
        ...debtToUpdate.sale,
      };
      saleToUpdate.isPaid = true;
      await saleService.update(saleToUpdate._id, saleToUpdate, axiosPrivate);

      debtUpdated.isPaid = true;

      return await debtService.update(
        debtUpdated._id,
        debtUpdated,
        axiosPrivate
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["debts"]);
    },
  });

  return { payDebt };
};
