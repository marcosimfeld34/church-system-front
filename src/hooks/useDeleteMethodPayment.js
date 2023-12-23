import { useMutation, useQueryClient } from "@tanstack/react-query";

import methodPaymentService from "../services/methodPayments";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDeleteMethodPayment = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: deleteMethodPayment } = useMutation({
    mutationFn: ({ methodPaymentId }) => {
      return methodPaymentService.delete(methodPaymentId, axiosPrivate);
    },
    onMutate: async (methodPaymentToDelete) => {
      queryClient.cancelQueries(["methodPayments"]);

      const previousMethodPayments = queryClient.getQueryData([
        "methodPayments",
      ]);

      queryClient.setQueryData(["methodPayments"], (oldData) => {
        if (oldData == null) return [];
        return [
          ...oldData.filter(
            (method) => method._id !== methodPaymentToDelete._id
          ),
        ];
      });

      return { previousMethodPayments };
    },
    onError: (error, variables, context) => {
      if (context?.previousMethodPayments != null) {
        queryClient.setQueryData(
          ["methodPayments"],
          context.previousMethodPayments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["methodPayments"]);
    },
  });

  return { deleteMethodPayment };
};
