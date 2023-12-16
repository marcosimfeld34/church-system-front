import { useMutation, useQueryClient } from "@tanstack/react-query";

import productService from "../services/product";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useUpdateManyProducts = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: updateManyProducts } = useMutation({
    mutationFn: (products) => productService.updateMany(products, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  return { updateManyProducts };
};
