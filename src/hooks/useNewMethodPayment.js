import { useMutation, useQueryClient } from "@tanstack/react-query";

import methodPaymentService from "../services/methodPayments";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useNewMethodPayment = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: addNewMethodPayment } = useMutation({
    mutationFn: (newMethodPayment) =>
      methodPaymentService.store(newMethodPayment, axiosPrivate),
    onMutate: async (newMethodPayment) => {
      queryClient.cancelQueries(["methodPayments"]);

      const previousMethodPayment = queryClient.getQueryData([
        "methodPayments",
      ]);

      queryClient.setQueryData(["methodPayments"], (oldData) => {
        if (oldData == null) return [newMethodPayment];
        return [newMethodPayment, ...oldData];
      });

      return { previousMethodPayment };
    },
    onError: (error, variables, context) => {
      if (context?.previousMethodPayment != null) {
        queryClient.setQueryData(
          ["methodPayments"],
          context.previousMethodPayment
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["methodPayments"]);
    },
  });

  return { addNewMethodPayment };
};
