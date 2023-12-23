import { useMutation, useQueryClient } from "@tanstack/react-query";

import methodPaymentService from "../services/methodPayments";

import useAxiosPrivate from "./useAxiosPrivate";

export const useEditMethodPayment = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: editMethodPayment } = useMutation({
    mutationFn: ({ methodPaymentId, methodPaymentToUpdate }) =>
      methodPaymentService.update(
        methodPaymentId,
        methodPaymentToUpdate,
        axiosPrivate
      ),
    onMutate: async (methodPaymentToUpdate) => {
      queryClient.cancelQueries(["methodPayments"]);

      const previousMethodPayment = queryClient.getQueryData([
        "methodPayments",
      ]);

      queryClient.setQueryData(["methodPayments"], (oldData) => {
        if (oldData == null) return [methodPaymentToUpdate];
        return [methodPaymentToUpdate, ...oldData];
      });

      return { previousMethodPayment };
    },
    onError: (error, variables, context) => {
      if (context?.previousCMethodPayment != null) {
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

  return { editMethodPayment };
};
