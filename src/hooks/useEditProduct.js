import { useMutation, useQueryClient } from "@tanstack/react-query";

import productService from "../services/product";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: editProduct } = useMutation({
    mutationFn: ({ productId, productToUpdate }) =>
      productService.update(productId, productToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  return { editProduct };
};
