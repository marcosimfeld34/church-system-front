import { useMutation, useQueryClient } from "@tanstack/react-query";

import saleDetailService from "../services/saleDetails";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useUpdateManySaleDetails = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: updateManySaleDetails } = useMutation({
    mutationFn: (saleDetailsToUpdate) =>
      saleDetailService.updateMany(saleDetailsToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["saleDetails"]);
    },
  });

  return { updateManySaleDetails };
};
