import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// components
import ClientAddEditForm from "./ClientAddEditForm";

// custom hooks
import { useClients } from "../../hooks/useClients";
import { useNewClient } from "../../hooks/useNewClient";
import { useEditClient } from "../../hooks/useEditClient";
import { useMessage } from "../../hooks/useMessage";
import { useError } from "../../hooks/useError";

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants";

const ClientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { throwError } = useError();
  const { showMessage } = useMessage();

  const { clientId } = useParams();

  const navigate = useNavigate();

  const queryClients = useClients({ id: clientId });
  const clientToUpdate = queryClients?.data ? { ...queryClients?.data[0] } : {};

  const { addNewClient } = useNewClient();
  const { editClient } = useEditClient();

  const onSubmit = async ({ name }) => {
    setIsLoading(true);

    try {
      let response;
      if (!clientId) {
        response = await addNewClient({ name });
        if (response.isStored) {
          showMessage(RECORD_CREATED, "success", "purple");
        }
      } else {
        clientToUpdate.name = name;
        response = await editClient({ clientId, clientToUpdate });
        if (response.isUpdated) {
          showMessage(RECORD_UPDATED, "success", "purple");
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/clients");
      }
    } catch (error) {
      throwError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelOperation = () => {
    navigate("/clients");
  };

  return (
    <ClientAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      clientToUpdate={clientId ? clientToUpdate : {}}
      isEditing={clientId ? true : false}
      isLoading={isLoading}
    />
  );
};

export default ClientForm;
