import { useMutation, useQueryClient } from "@tanstack/react-query";

import productService from "../services/product";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useNewProduct = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: addNewProduct } = useMutation({
    mutationFn: (newProduct) => productService.store(newProduct, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  return { addNewProduct };
};
