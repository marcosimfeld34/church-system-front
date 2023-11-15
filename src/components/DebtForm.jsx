import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { useToast } from "@chakra-ui/react";

// components
import DebtFormAdd from "./DebtFormAdd";
import DebtFormEdit from "./DebtFormEdit";

// services
import debtService from "../services/debt";
import saleService from "../services/sale";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useDebtContext } from "../hooks/useDebtContext";
import { useClientContext } from "../hooks/useClientContext";
import { useSaleContext } from "../hooks/useSaleContext";

const DebtForm = () => {
  const { user, logout } = useAuthContext();
  const { getClients } = useClientContext();
  const { getDebts } = useDebtContext();
  const { getSales } = useSaleContext();

  const toast = useToast();

  const { debtId } = useParams();

  const navigate = useNavigate();

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  const { data: debts } = useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
  });

  const onSubmit = async ({ client, sale, initialAmount, deliveredAmount }) => {
    if (user !== null) {
      // let newDebt = {
      //   client,
      //   sale,
      //   initialAmount,
      //   deliveredAmount,
      // };

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
        let debtUpdated = {
          ...debts?.find((c) => c._id === debtId),
        };

        debtUpdated.client = client;
        debtUpdated.sale = sale;
        debtUpdated.initialAmount = initialAmount;
        debtUpdated.deliveredAmount = deliveredAmount;

        try {
          if (debtUpdated.initialAmount === debtUpdated.deliveredAmount) {
            let saleToUpdate = {
              ...sales?.filter((sale) => sale._id === debtUpdated.sale)[0],
            };
            saleToUpdate.isPaid = true;
            await saleService.update(saleToUpdate._id, saleToUpdate);

            debtUpdated.isPaid = true;
          }

          await debtService.update(debtId, debtUpdated);

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
            logout();
          } else if (
            error.response.data.status === 400 &&
            error.response.data.message === "MISSING_FIELDS_REQUIRED"
          ) {
            console.log(error.response.data.message);
            // handleSetMessage(MISSING_FIELDS_REQUIRED);
            // handleSetType("danger");
            // handleSetRecordType("budget");
          }
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
            ...debts?.find((d) => d._id === debtId),
          }}
          clients={clients}
          sales={sales}
        />
      )}
      {!debtId && (
        <DebtFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          clients={clients}
          sales={sales}
        />
      )}
    </>
  );
};

export default DebtForm;
