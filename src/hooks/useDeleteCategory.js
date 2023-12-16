import { useMutation, useQueryClient } from "@tanstack/react-query";

import categoryService from "../services/category";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: ({ categoryId }) => {
      return categoryService.delete(categoryId, axiosPrivate);
    },
    onMutate: async (categoryToDelete) => {
      queryClient.cancelQueries(["categories"]);

      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (oldData) => {
        if (oldData == null) return [];
        return [...oldData.filter((c) => c._id !== categoryToDelete._id)];
      });

      return { previousCategories };
    },
    onError: (error, variables, context) => {
      if (context?.previousCategories != null) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  return { deleteCategory };
};
