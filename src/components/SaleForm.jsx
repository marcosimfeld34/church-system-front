import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";

// components
import SaleFormAdd from "./SaleFormAdd";
import SaleFormEdit from "./SaleFormEdit";

// services
import saleService from "../services/sale";
import productService from "../services/product";
import saleDetailService from "../services/saleDetails";
import debtService from "../services/debt";

// custom hooks
import { useProductContext } from "../hooks/useProductContext";
import { useSaleContext } from "../hooks/useSaleContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useClientContext } from "../hooks/useClientContext";
import { useSaleDetailContext } from "../hooks/useSaleDetailContext";
import { useDebtContext } from "../hooks/useDebtContext";

const SaleForm = () => {
  const { user, logout } = useAuthContext();

  const { getProducts } = useProductContext();

  const { getClients } = useClientContext();

  const { getSales } = useSaleContext();

  const { getSaleDetails } = useSaleDetailContext();

  const { getDebts } = useDebtContext();

  const toast = useToast();

  const navigate = useNavigate();

  const { saleId } = useParams();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  const { data: saleDetails } = useQuery({
    queryKey: ["saleDetails"],
    queryFn: getSaleDetails,
  });

  const { data: debts } = useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
  });

  const onSubmit = async ({ client, isPaid, saleItems }) => {
    if (user !== null) {
      let newSale = {
        client,
        isPaid,
      };

      if (!saleId) {
        try {
          let productWithSalePrice = [];
          let productIds = saleItems?.map((saleItem) => saleItem.product);
          let productsToUpdate = [];
          products.forEach((p) => {
            if (productIds.includes(p._id)) {
              productsToUpdate.push({ id: p._id, stock: p.stock });
              productWithSalePrice.push({ id: p._id, salePrice: p.salePrice });
            }
          });

          productsToUpdate?.map((productToupdate) => {
            saleItems.forEach((saleItem) => {
              if (saleItem.product === productToupdate.id) {
                productToupdate.stock =
                  productToupdate.stock - saleItem.quantity;
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

          const { data } = await saleService.store(newSale);

          let saleItemWithSale = undefined;

          if (data) {
            if (!isPaid) {
              let newDebt = {
                client,
                sale: data._id,
                initialAmount: newSale.total,
                deliveredAmount: 0,
                isPaid: false,
              };

              await debtService.store(newDebt);
            }

            saleItemWithSale = saleItems.map((saleItem) => {
              return { ...saleItem, sale: data._id };
            });

            await saleDetailService.storeMany({
              saleDetails: saleItemWithSale,
            });
          }

          await productService.updateMany({
            products: productsToUpdate,
          });

          toast({
            position: "top",
            title: "Venta creada.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });

          navigate("/");
        } catch (error) {
          if (
            error.response.data.status === 400 &&
            error.response.data.message === "INVALID_TOKEN"
          ) {
            logout();
          }
          if (
            error.response.data.status === 400 &&
            error.response.data.message === "MISSING_FIELDS_REQUIRED"
          ) {
            console.log(error.response.data.message);
          }
        }
      } else {
        try {
          let productWithSalePrice = [];
          let oldSaleItems = [];
          saleDetails?.forEach((saleDetail) => {
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
          products.forEach((p) => {
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

          await productService.updateMany({
            products: oldProductsToUpdate,
          });

          let productIds = saleItems?.map((saleItem) => saleItem.product);
          let productsToUpdate = [];
          products.forEach((p) => {
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

          const { data } = await saleService.update(saleId, newSale);

          let saleItemWithSale = [];

          let newSaleItems = [];

          if (data) {
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
              ...debts?.filter((debt) => debt.sale._id === data._id)[0],
            };

            if (!isPaid && JSON.stringify(debtToUpdate) !== "{}") {
              debtToUpdate.initialAmount = newSale.total;
              debtToUpdate.deliveredAmount = 0;
              debtToUpdate.isPaid = false;
              await debtService.update(debtToUpdate._id, debtToUpdate);
            } else if (!isPaid) {
              let newDebt = {
                client,
                sale: data._id,
                initialAmount: newSale.total,
                deliveredAmount: 0,
                isPaid: false,
              };

              await debtService.store(newDebt);
            } else if (isPaid && JSON.stringify(debtToUpdate) !== "{}") {
              debtToUpdate.initialAmount = newSale.total;
              debtToUpdate.deliveredAmount = newSale.total;
              debtToUpdate.isPaid = true;
              await debtService.update(debtToUpdate._id, debtToUpdate);
            }

            await saleDetailService.updateMany({
              saleDetails: saleItemWithSale,
            });

            await saleDetailService.storeMany({ saleDetails: newSaleItems });
          }

          await productService.updateMany({
            products: productsToUpdate,
          });

          toast({
            position: "top",
            title: "Venta actualizada.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });

          navigate("/");
        } catch (error) {
          if (
            error.response.data.status === 400 &&
            error.response.data.message === "INVALID_TOKEN"
          ) {
            logout();
          } else if (
            error.response.data.status === 400 &&
            error.response.data.message === "MISSING_FIELDS_REQUIRED"
          ) {
            console.log(error.response.data.message);
          }
        }
      }
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
          saleToUpdate={{ ...sales?.find((s) => s._id === saleId) }}
          products={products}
          clients={clients}
        />
      )}
      {!saleId && (
        <SaleFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          products={products?.filter((product) => product.stock > 0)}
          clients={clients}
        />
      )}
    </>
  );
};

export default SaleForm;
