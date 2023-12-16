import { useMutation, useQueryClient } from "@tanstack/react-query";

import saleDetailService from "../services/saleDetails";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useAddManySaleDetails = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: addManySaleDetails } = useMutation({
    mutationFn: (newSaleDetails) =>
      saleDetailService.storeMany(newSaleDetails, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["saleDetails"]);
    },
  });

  return { addManySaleDetails };
};
