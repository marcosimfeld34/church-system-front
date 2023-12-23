import { useNavigate, useParams, useLocation } from "react-router-dom";

// components
import MethodPaymentFormAdd from "./MethodPaymentFormAdd";
import MethodPaymentFormEdit from "./MethodPaymentFormEdit";

// custom hooks
import { useMethodPayments } from "../hooks/useMethodPayments";
import { useNewMethodPayment } from "../hooks/useNewMethodPayment";
import { useEditMethodPayment } from "../hooks/useEditMethodPayment";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";

const MethodPaymentForm = () => {
  const { showMessage } = useMessage();

  const { methodPaymentId } = useParams();

  const navigate = useNavigate();
  const { logout } = useLogout();
  const location = useLocation();

  const queryMethodPayments = useMethodPayments();
  const { addNewMethodPayment } = useNewMethodPayment();
  const { editMethodPayment } = useEditMethodPayment();

  const onSubmit = async ({ name }) => {
    let newMethodPayment = {
      name,
    };

    if (!methodPaymentId) {
      try {
        await addNewMethodPayment(newMethodPayment);

        showMessage("Método de pago creado.", "success", "purple");

        navigate("/methodPayments");
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
      let methodPaymentUpdated = {
        ...queryMethodPayments?.data?.find(
          (method) => method._id === methodPaymentId
        ),
      };

      methodPaymentUpdated.name = name;

      try {
        await editMethodPayment({
          methodPaymentId,
          methodPaymentToUpdate: methodPaymentUpdated,
        });

        showMessage("Método de pago actualizado.", "success", "purple");

        navigate("/methodPayments");
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
    navigate("/methodPayments");
  };

  return (
    <>
      {methodPaymentId && (
        <MethodPaymentFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          methodPaymentToUpdate={{
            ...queryMethodPayments?.data?.find(
              (method) => method._id === methodPaymentId
            ),
          }}
        />
      )}
      {!methodPaymentId && (
        <MethodPaymentFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
        />
      )}
    </>
  );
};

export default MethodPaymentForm;
