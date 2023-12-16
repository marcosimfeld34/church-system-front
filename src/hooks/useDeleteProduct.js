import { useMutation, useQueryClient } from "@tanstack/react-query";

import productService from "../services/product";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: deleteProduct } = useMutation({
    mutationFn: ({ productId }) => {
      return productService.delete(productId, axiosPrivate);
    },
    onMutate: async (productToDelete) => {
      queryClient.cancelQueries(["products"]);

      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (oldData) => {
        if (oldData == null) return [];
        return [...oldData.filter((c) => c._id !== productToDelete._id)];
      });

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      if (context?.previousProducts != null) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  return { deleteProduct };
};
