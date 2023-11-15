import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";

// components
import ClientFormAdd from "./ClientFormAdd";
import ClientFormEdit from "./ClientFormEdit";

import { useToast } from "@chakra-ui/react";

// services
import clientService from "../services/client";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useClientContext } from "../hooks/useClientContext";

const ClientForm = () => {
  const { user, logout } = useAuthContext();

  const toast = useToast();

  const { getClients } = useClientContext();

  const { clientId } = useParams();

  const navigate = useNavigate();

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const onSubmit = async ({ name, amountToPay }) => {
    if (user !== null) {
      let newClient = {
        name,
        amountToPay,
      };

      if (!clientId) {
        try {
          await clientService.store(newClient);

          toast({
            position: "top",
            title: "Cliente creado.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });

          navigate("/clients");
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
        let clientUpdated = {
          ...clients?.find((c) => c._id === clientId),
        };

        clientUpdated.name = name;
        clientUpdated.amountToPay = amountToPay;

        try {
          await clientService.update(clientId, clientUpdated);

          toast({
            position: "top",
            title: "Cliente actualizado.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });

          navigate("/clients");
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
    navigate("/clients");
  };

  return (
    <>
      {clientId && (
        <ClientFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          clientToUpdate={{
            ...clients?.find((c) => c._id === clientId),
          }}
        />
      )}
      {!clientId && (
        <ClientFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
        />
      )}
    </>
  );
};

export default ClientForm;
