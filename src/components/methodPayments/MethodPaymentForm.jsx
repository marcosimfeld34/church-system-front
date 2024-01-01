import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// components
import MethodPaymentAddEditForm from "./MethodAddEditForm";

// custom hooks
import { useMethodPayments } from "../../hooks/useMethodPayments";
import { useNewMethodPayment } from "../../hooks/useNewMethodPayment";
import { useEditMethodPayment } from "../../hooks/useEditMethodPayment";
import { useMessage } from "../../hooks/useMessage";
import { useError } from "../../hooks/useError";

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants";

const MethodPaymentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { throwError } = useError();
  const { showMessage } = useMessage();

  const { methodPaymentId } = useParams();

  const navigate = useNavigate();

  const queryMethodPayments = useMethodPayments({ id: methodPaymentId });
  const methodPaymentToUpdate = queryMethodPayments?.data
    ? { ...queryMethodPayments?.data[0] }
    : {};

  const { addNewMethodPayment } = useNewMethodPayment();
  const { editMethodPayment } = useEditMethodPayment();

  const onSubmit = async ({ name }) => {
    setIsLoading(true);

    try {
      let response;
      if (!methodPaymentId) {
        response = await addNewMethodPayment({ name });
        if (response.isStored) {
          showMessage(RECORD_CREATED, "success", "purple");
        }
      } else {
        methodPaymentToUpdate.name = name;
        response = await editMethodPayment({
          methodPaymentId,
          methodPaymentToUpdate,
        });
        if (response.isUpdated) {
          showMessage(RECORD_UPDATED, "success", "purple");
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/methodPayments");
      }
    } catch (error) {
      throwError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelOperation = () => {
    navigate("/methodPayments");
  };

  return (
    <MethodPaymentAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      methodPaymentToUpdate={methodPaymentId ? methodPaymentToUpdate : {}}
      isEditing={methodPaymentId ? true : false}
      isLoading={isLoading}
    />
  );
};

export default MethodPaymentForm;
