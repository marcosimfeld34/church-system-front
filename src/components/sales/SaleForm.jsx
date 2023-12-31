import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// components
import SaleFormAdd from "./SaleFormAdd";
import SaleFormEdit from "./SaleFormEdit";

// custom hooks
import { useProducts } from "../../hooks/useProducts";
import { useClients } from "../../hooks/useClients";
import { useSales } from "../../hooks/useSales";
import { useSaleDetails } from "../../hooks/useSaleDetails";
import { useDebts } from "../../hooks/useDebts";
import { useNewSale } from "../../hooks/useNewSale";
import { useAddManySaleDetails } from "../../hooks/useAddManySaleDetails";
import { useNewDebt } from "../../hooks/useNewDebt";
import { useUpdateManyProducts } from "../../hooks/useUpdateManyProducts";
import { useUpdateSale } from "../../hooks/useUpdateSale";
import { useUpdateManySaleDetails } from "../../hooks/useUpdateManySaleDetails";
import { useUpdateDebt } from "../../hooks/useUpdateDebt";
import { useMessage } from "../../hooks/useMessage";
import { useMethodPayments } from "../../hooks/useMethodPayments";
import { useError } from "../../hooks/useError";
import { useTodayDate } from "../../hooks/useTodayDate";

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants";

const SaleForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const today = useTodayDate();

  const { showMessage } = useMessage();

  const { throwError } = useError();

  const navigate = useNavigate();

  const { saleId } = useParams();

  // sales
  const { addNewSale } = useNewSale();
  const { updateSale } = useUpdateSale();

  // salesDetails
  const { addManySaleDetails } = useAddManySaleDetails();
  const { updateManySaleDetails } = useUpdateManySaleDetails();

  // debts
  const { addNewDebt } = useNewDebt();
  const { updateDebt } = useUpdateDebt();

  // products
  const { updateManyProducts } = useUpdateManyProducts();

  const queryProducts = useProducts();
  const queryClients = useClients();
  const queryMethodPayments = useMethodPayments();
  const queryDebts = useDebts();
  const { query: querySales } = useSales({ all: false });
  const { query: querySaleDetails } = useSaleDetails({ all: false });

  const onSubmit = async ({ client, methodPayment, isPaid, saleItems }) => {
    setIsLoading(true);
    let newSale = {
      client,
      methodPayment,
      isPaid,
    };

    try {
      let response;
      if (!saleId) {
        // insert
        let productWithSalePrice = [];
        let productIds = saleItems?.map((saleItem) => saleItem.product);
        let productsToUpdate = [];
        queryProducts?.data.forEach((p) => {
          if (productIds.includes(p._id)) {
            productsToUpdate.push({ id: p._id, stock: p.stock });
            productWithSalePrice.push({ id: p._id, salePrice: p.salePrice });
          }
        });

        productsToUpdate?.map((productToupdate) => {
          saleItems.forEach((saleItem) => {
            if (saleItem.product === productToupdate.id) {
              productToupdate.stock = productToupdate.stock - saleItem.quantity;
            }
          });
        });

        saleItems.map((saleItem) => {
          productWithSalePrice.forEach((product) => {
            if (product.id === saleItem.product) {
              saleItem.subtotal = saleItem.quantity * product.salePrice;
            }
          });
        });

        newSale.total = Number.parseFloat(
          saleItems
            ?.map((saleItem) => saleItem.subtotal)
            .reduce((acc, currentValue) => acc + currentValue, 0)
            .toFixed(2)
        );

        const { data, isStored, status } = await addNewSale(newSale);

        let saleItemWithSale = undefined;

        if (isStored && status === 201 && data) {
          if (!isPaid) {
            let newDebt = {
              client,
              sale: data._id,
              initialAmount: newSale.total,
              deliveredAmount: 0,
              isPaid: false,
            };

            await addNewDebt(newDebt);
          }

          saleItemWithSale = saleItems.map((saleItem) => {
            return { ...saleItem, sale: data._id };
          });

          const { isStored, status } = await addManySaleDetails({
            saleDetails: saleItemWithSale,
          });

          if (isStored && status === 201) {
            response = await updateManyProducts({
              products: productsToUpdate,
            });

            if (response.isUpdated && response.status === 200) {
              showMessage(RECORD_CREATED, "success", "purple");
            }
          }
        }
      } else {
        // update
        let productWithSalePrice = [];
        let oldSaleItems = [];
        querySaleDetails?.data?.forEach((saleDetail) => {
          if (saleDetail.sale === saleId) {
            oldSaleItems.push({
              product: saleDetail.product._id,
              quantity: saleDetail.quantity,
              id: saleDetail._id,
            });
          }
        });

        let oldProductIds = oldSaleItems?.map(
          (oldSaleItem) => oldSaleItem.product
        );

        let oldProductsToUpdate = [];
        queryProducts?.data.forEach((p) => {
          if (oldProductIds.includes(p._id)) {
            oldProductsToUpdate.push({ id: p._id, stock: p.stock });
          }
        });

        oldProductsToUpdate?.map((productToupdate) => {
          oldSaleItems.forEach((oldSaleItem) => {
            if (oldSaleItem.product === productToupdate.id) {
              productToupdate.stock =
                productToupdate.stock + oldSaleItem.quantity;
            }
          });
        });

        const res = await updateManyProducts({
          products: oldProductsToUpdate,
        });

        let productIds = saleItems?.map((saleItem) => saleItem.product);
        let productsToUpdate = [];

        if (res.isUpdated) {
          queryProducts?.data.forEach((p) => {
            if (productIds.includes(p._id)) {
              productsToUpdate.push({ id: p._id, stock: p.stock });
              productWithSalePrice.push({ id: p._id, salePrice: p.salePrice });
            }
          });

          productsToUpdate?.map((productToupdate) => {
            oldSaleItems.forEach((oldSaleItem) => {
              if (oldSaleItem.product === productToupdate.id) {
                productToupdate.stock =
                  productToupdate.stock + oldSaleItem.quantity;
              }
            });
          });

          productsToUpdate?.map((productToupdate) => {
            saleItems.forEach((saleItem) => {
              if (saleItem.product === productToupdate.id) {
                productToupdate.stock =
                  productToupdate.stock - saleItem.quantity;
              }
            });
          });
        }

        saleItems.map((saleItem) => {
          productWithSalePrice.forEach((product) => {
            if (product.id === saleItem.product) {
              saleItem.subtotal = saleItem.quantity * product.salePrice;
            }
          });
        });

        newSale.total = Number.parseFloat(
          saleItems
            ?.map((saleItem) => saleItem.subtotal)
            .reduce((acc, currentValue) => acc + currentValue, 0)
            .toFixed(2)
        );

        const { data, status, isUpdated } = await updateSale({
          saleId,
          saleToUpdate: newSale,
        });

        let saleItemWithSale = [];

        let newSaleItems = [];

        if (isUpdated && status === 200 && data) {
          saleItems.forEach((saleItem) => {
            if (saleItem.hasOwnProperty("id")) {
              saleItemWithSale.push({ ...saleItem, sale: data._id });
            }
          });

          saleItems.forEach((saleItem) => {
            if (!saleItem.hasOwnProperty("id")) {
              newSaleItems.push({ ...saleItem, sale: data._id });
            }
          });

          let debtToUpdate = {
            ...queryDebts?.data?.filter(
              (debt) => debt.sale._id === data._id
            )[0],
          };

          if (!isPaid && JSON.stringify(debtToUpdate) !== "{}") {
            debtToUpdate.initialAmount = newSale.total;
            debtToUpdate.deliveredAmount = 0;
            debtToUpdate.isPaid = false;
            await updateDebt({ debtId: debtToUpdate._id, debtToUpdate });
          } else if (!isPaid) {
            let newDebt = {
              client,
              sale: data._id,
              initialAmount: newSale.total,
              deliveredAmount: 0,
              isPaid: false,
            };

            await addNewDebt(newDebt);
          } else if (isPaid && JSON.stringify(debtToUpdate) !== "{}") {
            debtToUpdate.initialAmount = newSale.total;
            debtToUpdate.deliveredAmount = newSale.total;
            debtToUpdate.isPaid = true;
            await updateDebt({ debtId: debtToUpdate._id, debtToUpdate });
          }

          const { isUpdated } = await updateManySaleDetails({
            saleDetails: saleItemWithSale,
          });

          if (isUpdated) {
            response = await addManySaleDetails({
              saleDetails: newSaleItems,
            });

            if (response.isStored) {
              await updateManyProducts({
                products: productsToUpdate,
              });

              showMessage(RECORD_UPDATED, "success", "purple");
            }
          }
        }
      }
      if (response.status === 200 || response.status === 201) {
        window.localStorage.setItem(
          "filters",
          JSON.stringify({
            startDate: today,
            endDate: today,
          })
        );

        navigate("/");
      }
    } catch (error) {
      throwError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelOperation = () => {
    navigate("/");
  };

  return (
    <>
      {saleId && (
        <SaleFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          saleToUpdate={{ ...querySales?.data?.find((s) => s._id === saleId) }}
          saleDetails={querySaleDetails?.data?.filter(
            (saleDetail) => saleDetail.sale === saleId
          )}
          isLoading={isLoading}
        />
      )}
      {!saleId && (
        <SaleFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default SaleForm;
