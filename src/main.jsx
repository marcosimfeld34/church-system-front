import ReactDOM from "react-dom/client";
import App from "./App";

import { ChakraProvider } from "@chakra-ui/react";

import { QueryClientProvider, QueryClient } from "react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UserContextProvider } from "./context/UserContext";
import { ProductContextProvider } from "./context/ProductContext";
import { CategoryContextProvider } from "./context/CategoryContext";
import { SaleContextProvider } from "./context/SaleContext";
import { ClientContextProvider } from "./context/ClientContext";
import { SaleDetailContextProvider } from "./context/SaleDetailContext";
import { DebtContextProvider } from "./context/DebtContext";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <UserContextProvider>
        <DebtContextProvider>
          <ClientContextProvider>
            <CategoryContextProvider>
              <ProductContextProvider>
                <SaleContextProvider>
                  <SaleDetailContextProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/*" element={<App />} />
                      </Routes>
                    </BrowserRouter>
                  </SaleDetailContextProvider>
                </SaleContextProvider>
              </ProductContextProvider>
            </CategoryContextProvider>
          </ClientContextProvider>
        </DebtContextProvider>
      </UserContextProvider>
    </ChakraProvider>
  </QueryClientProvider>
  // </React.StrictMode>
);
