import { useMutation, useQueryClient } from "@tanstack/react-query";

import saleService from "../services/sale";
import productService from "../services/product";
import saleDetailService from "../services/saleDetails";
import debtService from "../services/debt";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutateAsync: deleteSale } = useMutation({
    mutationFn: async ({ saleId, saleDetails, debt }) => {
      try {
        const productsToUpdate = [];
        saleDetails.forEach((saleDetail) => {
          productsToUpdate.push(saleDetail.product);
        });

        saleDetails.forEach((saleDetail) => {
          productsToUpdate.forEach((productToUpdate) => {
            if (saleDetail.product._id === productToUpdate._id) {
              productToUpdate.stock =
                productToUpdate.stock + saleDetail.quantity;
            }
          });
        });

        const uniqByKeepLast = (data, key) => {
          return [...new Map(data.map((x) => [key(x), x])).values()];
        };

        let products = [];

        productsToUpdate.forEach((productToUpdate) => {
          products.push({
            id: productToUpdate._id,
            stock: productToUpdate.stock,
          });
        });

        products = uniqByKeepLast(products, (it) => it.id);

        const response = await saleService.delete(saleId, axiosPrivate);

        if (response.isDeleted) {
          const response = await saleDetailService.deleteMany(
            { saleDetails: saleDetails.map((saleDetail) => saleDetail._id) },
            axiosPrivate
          );

          if (response.isDeleted) {
            await productService.updateMany({ products }, axiosPrivate);

            if (debt) {
              await debtService.delete(debt._id, axiosPrivate);
            }

            return { isDeleted: true };
          }
        }
      } catch (error) {
        console.log(error);
        return { isDeleted: false };
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["saleDetails"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });

  return { deleteSale };
};
