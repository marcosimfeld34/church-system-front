import { createContext, useState } from "react";

import { useQueryClient } from "react-query";

import { useToast } from "@chakra-ui/react";

// services
import clientService from "../services/client";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

export const ClientContext = createContext();

export const ClientContextProvider = ({ children }) => {
  const { user, logout } = useAuthContext();
  const [clients, setClients] = useState([]);

  const toast = useToast();

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const getClients = async (key) => {
    if (user !== null) {
      try {
        const clientId = key.queryKey[1]?.id;

        const filters = key.queryKey[1]?.filters;

        const { data } = await clientService.getAll({
          ...filters,
        });

        if (clientId) {
          setClients(data.filter((c) => c._id === clientId));
          return data.filter((c) => c._id === clientId)[0];
        }
        if (!filters) {
          setClients(data);
        }

        return data;
      } catch (err) {
        if (
          err.response.data.status === 400 &&
          err.response.data.message === "INVALID_TOKEN"
        ) {
          logout();
        }
      }
    }
  };

  const handleDeleteClient = async (client) => {
    if (user !== null) {
      try {
        await clientService.delete(client._id);

        toast({
          position: "top",
          title: "Cliente eliminada.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        queryClient.invalidateQueries({ queryKey: ["clients"] });
      } catch (error) {
        if (
          error.response.data.status === 400 &&
          error.response.data.message === "INVALID_TOKEN"
        ) {
          logout();
        }
      }
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        getClients,
        handleDeleteClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
