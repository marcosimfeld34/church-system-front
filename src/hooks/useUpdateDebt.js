import { useMutation, useQueryClient } from "@tanstack/react-query";

import debtService from "../services/debt";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useUpdateDebt = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: updateDebt } = useMutation({
    mutationFn: ({ debtId, debtToUpdate }) =>
      debtService.update(debtId, debtToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["debts"]);
    },
  });

  return { updateDebt };
};
