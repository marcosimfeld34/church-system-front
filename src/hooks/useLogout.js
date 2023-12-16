import loginService from "../services/login";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { setAuth } = useAuthContext();

  const logout = async () => {
    try {
      const response = await loginService.logout();

      if (response?.status === 204) {
        setAuth({});
        return { loggedOut: true };
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { logout };
};
