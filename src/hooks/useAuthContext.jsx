import { useContext } from "react";

import { UserContext } from "../context/UserContext";

export function useAuthContext() {
  return useContext(UserContext);
}
