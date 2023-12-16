import { useNavigate, useParams, useLocation } from "react-router-dom";

// components
import SaleFormAdd from "./SaleFormAdd";
import SaleFormEdit from "./SaleFormEdit";

// custom hooks
import { useProducts } from "../hooks/useProducts";
import { useClients } from "../hooks/useClients";
import { useSales } from "../hooks/useSales";
import { useSaleDetails } from "../hooks/useSaleDetails";
import { useDebts } from "../hooks/useDebts";
import { useNewSale } from "../hooks/useNewSale";
import { useAddManySaleDetails } from "../hooks/useAddManySaleDetails";
import { useNewDebt } from "../hooks/useNewDebt";
import { useUpdateManyProducts } from "../hooks/useUpdateManyProducts";
import { useUpdateSale } from "../hooks/useUpdateSale";
import { useUpdateManySaleDetails } from "../hooks/useUpdateManySaleDetails";
import { useUpdateDebt } from "../hooks/useUpdateDebt";
import { useMessage } from "../hooks/useMessage";
import { useLogout } from "../hooks/useLogout";

const SaleForm = () => {
  const { showMessage } = useMessage();

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
  const querySales = useSales();
  const querySaleDetails = useSaleDetails();
  const queryDebts = useDebts();

  const { logout } = useLogout();
  const location = useLocation();

  const onSubmit = async ({ client, isPaid, saleItems }) => {
    let newSale = {
      client,
      isPaid,
    };

    if (!saleId) {
      try {
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
            const { isUpdated, status } = await updateManyProducts({
              products: productsToUpdate,
            });

            if (isUpdated && status === 200) {
              showMessage("Venta creada.", "success", "purple");

              navigate("/");
            }
          }
        }
      } catch (error) {
        if (error?.response?.status === 403) {
          logout().then((res) => {
            if (res.loggedOut) {
              showMessage("Venció la sesión", "success", "purple");
              navigate("/login", { state: { from: location }, replace: true });
            }
          });
        } else if (
          error?.response?.data?.status === 400 &&
          error?.response?.data?.message === "MISSING_FIELDS_REQUIRED"
        ) {
          showMessage(
            "¡Hubo un error!",
            "error",
            "red",
            "Hay campos incompletos."
          );
          return false;
        } else {
          showMessage(
            "¡Hubo un error!",
            "error",
            "red",
            "No se pudo guardar la venta."
          );
          navigate("/");
        }
      }
    } else {
      try {
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

        await updateManyProducts({
          products: oldProductsToUpdate,
        });

        let productIds = saleItems?.map((saleItem) => saleItem.product);
        let productsToUpdate = [];
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
            const { isStored } = await addManySaleDetails({
              saleDetails: newSaleItems,
            });

            if (isStored) {
              await updateManyProducts({
                products: productsToUpdate,
              });

              showMessage("Venta actualizada.", "success", "purple");

              navigate("/");
            }
          }
        }
      } catch (error) {
        if (error?.response?.status === 403) {
          logout().then((res) => {
            if (res.loggedOut) {
              showMessage("Venció la sesión", "success", "purple");
              navigate("/login", { state: { from: location }, replace: true });
            }
          });
        } else if (
          error?.response?.data?.status === 400 &&
          error?.response?.data?.message === "MISSING_FIELDS_REQUIRED"
        ) {
          showMessage(
            "¡Hubo un error!",
            "error",
            "red",
            "Hay campos incompletos."
          );
          return false;
        } else {
          showMessage(
            "¡Hubo un error!",
            "error",
            "red",
            "No se pudo guardar la venta."
          );
          navigate("/");
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
          saleToUpdate={{ ...querySales?.data?.find((s) => s._id === saleId) }}
        />
      )}
      {!saleId && (
        <SaleFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
        />
      )}
    </>
  );
};

export default SaleForm;
