import { createContext } from "react";

import { useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || true
  );

  return (
    <UserContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
