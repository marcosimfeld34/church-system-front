import { useMutation, useQueryClient } from "@tanstack/react-query";

import saleDetailService from "../services/saleDetails";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDeleteManySaleDetails = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: deleteManySaleDetails } = useMutation({
    mutationFn: (saleDetails) =>
      saleDetailService.deleteMany(saleDetails, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["saleDetails"]);
    },
  });

  return { deleteManySaleDetails };
};
