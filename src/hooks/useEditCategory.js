import { useMutation, useQueryClient } from "@tanstack/react-query";

import categoryService from "../services/category";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: editCategory } = useMutation({
    mutationFn: ({ categoryId, categoryToUpdate }) =>
      categoryService.update(categoryId, categoryToUpdate, axiosPrivate),
    onMutate: async (categoryToUpdate) => {
      queryClient.cancelQueries(["categories"]);

      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (oldData) => {
        if (oldData == null) return [categoryToUpdate];
        return [categoryToUpdate, ...oldData];
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

  return { editCategory };
};
