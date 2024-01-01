import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";
import { useNavigate, useLocation } from "react-router-dom";

import {
  TOKEN_EXPIRED_MESSAGE,
  SOMETHING_WENT_WRONG_MESSAGE,
} from "../utils/constants";

export const useError = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const location = useLocation();

  const throwError = (error) => {
    if (error?.response?.status === 403) {
      logout().then((res) => {
        if (res.loggedOut) {
          showMessage(TOKEN_EXPIRED_MESSAGE, "success", "purple");
          navigate("/login", { state: { from: location }, replace: true });
        }
      });
    }
    if (error?.response?.status === 400) {
      showMessage(SOMETHING_WENT_WRONG_MESSAGE, "error", "red");
    }
  };

  return { throwError };
};
