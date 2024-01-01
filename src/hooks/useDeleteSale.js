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
      if (!saleId) {
        return await debtService.delete(debt._id, axiosPrivate);
      }
      const productsToUpdate = [];
      saleDetails?.forEach((saleDetail) => {
        if (saleDetail.product !== null) {
          productsToUpdate.push(saleDetail.product);
        }
      });

      saleDetails?.forEach((saleDetail) => {
        productsToUpdate?.forEach((productToUpdate) => {
          if (saleDetail?.product._id === productToUpdate?._id) {
            productToUpdate.stock = productToUpdate.stock + saleDetail.quantity;
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

      const deleteRest = async () => {
        const response = await saleService.delete(saleId, axiosPrivate);

        if (response.isDeleted) {
          const response = await saleDetailService.deleteMany(
            { saleDetails: saleDetails.map((saleDetail) => saleDetail._id) },
            axiosPrivate
          );

          if (response.isDeleted) {
            return await productService.updateMany({ products }, axiosPrivate);
          }
        }
      };

      if (debt) {
        const response = await debtService.delete(debt._id, axiosPrivate);

        if (response.isDeleted) {
          return deleteRest();
        }
      }

      return deleteRest();
    },
    onSettled: (response) => {
      if (response?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["saleDetails"] });
        queryClient.invalidateQueries({ queryKey: ["debts"] });
      }
    },
  });

  return { deleteSale };
};
