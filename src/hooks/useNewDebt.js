import { useMutation, useQueryClient } from "@tanstack/react-query";

import debtService from "../services/debt";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useNewDebt = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: addNewDebt } = useMutation({
    mutationFn: (newDebt) => debtService.store(newDebt, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["debts"]);
    },
  });

  return { addNewDebt };
};
