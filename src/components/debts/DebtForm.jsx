import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// components
import DebtAddEditForm from "./DebtAddEditForm";

// custom hooks
import { useClients } from "../../hooks/useClients";
import { useSales } from "../../hooks/useSales";
import { useDebts } from "../../hooks/useDebts";
import { useUpdateDebt } from "../../hooks/useUpdateDebt";
import { useUpdateSale } from "../../hooks/useUpdateSale";
import { useMessage } from "../../hooks/useMessage";
import { useError } from "../../hooks/useError";

import { RECORD_UPDATED } from "../../utils/constants";

const DebtForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { throwError } = useError();
  const { showMessage } = useMessage();

  const { debtId } = useParams();

  const navigate = useNavigate();

  const queryDebts = useDebts({ id: debtId });
  const debtToUpdate = queryDebts?.data ? { ...queryDebts?.data[0] } : {};
  const queryClients = useClients();
  const { query: querySales } = useSales({
    all: false,
    id: debtToUpdate?.sale?._id,
  });

  const { updateDebt } = useUpdateDebt();
  const { updateSale } = useUpdateSale();

  const onSubmit = async ({ client, sale, initialAmount, deliveredAmount }) => {
    setIsLoading(true);

    try {
      let response;
      if (!debtId) {
        // here insert if needed
      } else {
        debtToUpdate.client = client;
        debtToUpdate.sale = sale;
        debtToUpdate.initialAmount = initialAmount;
        debtToUpdate.deliveredAmount = deliveredAmount;

        if (debtToUpdate.initialAmount === debtToUpdate.deliveredAmount) {
          let saleToUpdate = {
            ...querySales?.data?.filter(
              (sale) => sale._id === debtToUpdate.sale
            )[0],
          };
          saleToUpdate.isPaid = true;
          await updateSale({
            saleId: saleToUpdate._id,
            saleToUpdate,
          });

          debtToUpdate.isPaid = true;
        }

        response = await updateDebt({
          debtId,
          debtToUpdate,
        });

        if (response.isUpdated) {
          showMessage(RECORD_UPDATED, "success", "purple");
        }
        if (response.status === 200 || response.status === 201) {
          navigate("/debts");
        }
      }
    } catch (error) {
      throwError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelOperation = () => {
    navigate("/debts");
  };

  return (
    <>
      <DebtAddEditForm
        onSubmit={onSubmit}
        onCancelOperation={onCancelOperation}
        debtToUpdate={debtId ? debtToUpdate : {}}
        isEditing={debtId ? true : false}
        isLoading={isLoading}
        clients={queryClients?.data}
        sales={querySales?.data}
      />
    </>
  );
};

export default DebtForm;
