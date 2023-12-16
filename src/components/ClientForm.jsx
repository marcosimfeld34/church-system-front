import { useNavigate, useParams, useLocation } from "react-router-dom";

// components
import ClientFormAdd from "./ClientFormAdd";
import ClientFormEdit from "./ClientFormEdit";

// custom hooks
import { useClients } from "../hooks/useClients";
import { useNewClient } from "../hooks/useNewClient";
import { useEditClient } from "../hooks/useEditClient";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";

const ClientForm = () => {
  const { showMessage } = useMessage();

  const { clientId } = useParams();

  const navigate = useNavigate();
  const { logout } = useLogout();
  const location = useLocation();

  const queryClients = useClients();
  const { addNewClient } = useNewClient();
  const { editClient } = useEditClient();

  const onSubmit = async ({ name, amountToPay }) => {
    let newClient = {
      name,
      amountToPay,
    };

    if (!clientId) {
      try {
        await addNewClient(newClient);

        showMessage("Cliente creado.", "success", "purple");

        navigate("/clients");
      } catch (error) {
        if (error?.response?.status === 403) {
          logout().then((res) => {
            if (res.loggedOut) {
              showMessage("Venció la sesión", "success", "purple");
              navigate("/login", { state: { from: location }, replace: true });
            }
          });
        }
        if (error?.response?.status === 400) {
          showMessage("Ocurrió un error", "success", "purple");
        }
      }
    } else {
      let clientUpdated = {
        ...queryClients?.data?.find((c) => c._id === clientId),
      };

      clientUpdated.name = name;
      clientUpdated.amountToPay = amountToPay;

      try {
        await editClient({ clientId, clientToUpdate: clientUpdated });

        showMessage("Cliente actualizado.", "success", "purple");

        navigate("/clients");
      } catch (error) {
        if (error?.response?.status === 403) {
          logout().then((res) => {
            if (res.loggedOut) {
              showMessage("Venció la sesión", "success", "purple");
              navigate("/login", { state: { from: location }, replace: true });
            }
          });
        } else if (error?.response?.status === 400) {
          showMessage("Ocurrió un error", "success", "purple");
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
            ...queryClients?.data?.find((c) => c._id === clientId),
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
