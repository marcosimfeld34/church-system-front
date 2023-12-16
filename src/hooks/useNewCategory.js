import { useMutation, useQueryClient } from "@tanstack/react-query";

import categoryService from "../services/category";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useNewCategory = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: addNewCategory } = useMutation({
    mutationFn: (newCategory) =>
      categoryService.store(newCategory, axiosPrivate),
    onMutate: async (newCategory) => {
      queryClient.cancelQueries(["categories"]);

      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (oldData) => {
        if (oldData == null) return [newCategory];
        return [newCategory, ...oldData];
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

  return { addNewCategory };
};
