import ReactDOM from "react-dom/client";
// import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from "./App";

import { ChakraProvider } from "@chakra-ui/react";

import React from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UserContextProvider } from "./context/UserContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 2,
    },
  },
});

// if (import.meta.env.VITE_VERCEL_ENV === "production") {
// disableReactDevTools();
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <UserContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </UserContextProvider>
      </ChakraProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  </React.StrictMode>
);
