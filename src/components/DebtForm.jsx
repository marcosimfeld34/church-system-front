import { useNavigate, useParams } from "react-router-dom";

import { useToast } from "@chakra-ui/react";

// components
import DebtFormAdd from "./DebtFormAdd";
import DebtFormEdit from "./DebtFormEdit";

// custom hooks
import { useClients } from "../hooks/useClients";
import { useSales } from "../hooks/useSales";
import { useDebts } from "../hooks/useDebts";
import { useUpdateDebt } from "../hooks/useUpdateDebt";
import { useUpdateSale } from "../hooks/useUpdateSale";

const DebtForm = () => {
  const toast = useToast();

  const { debtId } = useParams();

  const navigate = useNavigate();

  const queryClients = useClients();
  const { query: querySales } = useSales({ all: false });
  const queryDebts = useDebts();

  const { updateDebt } = useUpdateDebt();
  const { updateSale } = useUpdateSale();

  const onSubmit = async ({ client, sale, initialAmount, deliveredAmount }) => {
    if (!debtId) {
      try {
        // console.log(newDebt);
        // await debtService.store(newDebt);
        // navigate("/debts");
      } catch (error) {
        if (
          error.response.data.status === 400 &&
          error.response.data.message === "INVALID_TOKEN"
        ) {
          // logout
        }
        if (
          error.response.data.status === 400 &&
          error.response.data.message === "MISSING_FIELDS_REQUIRED"
        ) {
          console.log(error.response.data.message);
        }
      }
    } else {
      let debtUpdated = {
        ...queryDebts?.data?.find((c) => c._id === debtId),
      };

      debtUpdated.client = client;
      debtUpdated.sale = sale;
      debtUpdated.initialAmount = initialAmount;
      debtUpdated.deliveredAmount = deliveredAmount;

      try {
        if (debtUpdated.initialAmount === debtUpdated.deliveredAmount) {
          let saleToUpdate = {
            ...querySales?.data?.filter(
              (sale) => sale._id === debtUpdated.sale
            )[0],
          };
          saleToUpdate.isPaid = true;
          await updateSale({ saleId: saleToUpdate._id, saleToUpdate });

          debtUpdated.isPaid = true;
        }

        await updateDebt({ debtId, debtToUpdate: debtUpdated });

        toast({
          position: "top",
          title: "Deuda actualizada.",
          status: "success",
          duration: 3000,
          isClosable: true,
          colorScheme: "purple",
        });

        navigate("/debts");
      } catch (error) {
        if (
          error.response.data.status === 400 &&
          error.response.data.message === "INVALID_TOKEN"
        ) {
          // logout
        } else if (
          error.response.data.status === 400 &&
          error.response.data.message === "MISSING_FIELDS_REQUIRED"
        ) {
          console.log(error.response.data.message);
        }
      }
    }
  };

  const onCancelOperation = () => {
    navigate("/debts");
  };

  return (
    <>
      {debtId && (
        <DebtFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          debtToUpdate={{
            ...queryDebts?.data?.find((d) => d._id === debtId),
          }}
          clients={queryClients?.data}
          sales={querySales?.data}
        />
      )}
      {!debtId && (
        <DebtFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          clients={queryClients?.data}
          sales={querySales?.data}
        />
      )}
    </>
  );
};

export default DebtForm;
