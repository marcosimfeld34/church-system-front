import { Routes, Route } from "react-router-dom";
import {
  Grid,
  GridItem,
  Tabs,
  TabList,
  Tab,
  Text,
  Flex,
  Card,
  CardBody,
  Box,
} from "@chakra-ui/react";
import {
  FaHouse,
  FaUsers,
  FaBoxesStacked,
  FaMoneyCheckDollar,
  FaTags,
} from "react-icons/fa6";

// components
import Header from "./Header";
import Products from "../products/Products";
import ProductForm from "../products/ProductForm";
import ProductDetails from "../products/ProductDetails";
import Sales from "../sales/Sales";
import SaleForm from "../sales/SaleForm";
import SaleDetails from "../sales/SaleDetails";
import Categories from "../categories/Categories";
import CategoryForm from "../categories/CategoryForm";
import ClientForm from "../clients/ClientForm";
import Clients from "../clients/Clients";
import MethodPayments from "../methodPayments/MethodPayments";
import MethodPaymentForm from "../methodPayments/MethodPaymentForm";
import Debts from "../debts/Debts";
import DebtForm from "../debts/DebtForm";
import BarChart from "../reports/BarChart";
import HistorySales from "../reports/HistorySales";
import PageNotFound from "./PageNotFound";

import { useNavigate, useLocation } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location?.pathname;

  const tabsIndex = new Map([
    ["/", 0],
    ["/debts", 1],
    ["/products", 2],
    ["/clients", 3],
    ["/categories", 4],
  ]);

  const goToSales = () => {
    navigate(`/`);
  };

  const goToDebts = () => {
    navigate(`/debts`);
  };

  const goToProducts = () => {
    navigate(`/products`);
  };

  const goToClients = () => {
    navigate(`/clients`);
  };

  const goToCategories = () => {
    navigate(`/categories`);
  };

  return (
    <>
      {import.meta.env.VITE_VERCEL_ENV === "development" && (
        <Box
          bgGradient="linear(to-r, blue.200, blue.500, blue.200)"
          w="100%"
          p={1}
          color="white"
          textAlign={"center"}
        >
          Sandbox Dev
        </Box>
      )}
      <Header />
      <Routes>
        <Route
          path="/products"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Products />
              </GridItem>
            </Grid>
          }
        />

        <Route path="/products/add" element={<ProductForm />} />
        <Route path="/products/:productId/edit" element={<ProductForm />} />
        <Route
          path="/products/:productId/details"
          element={<ProductDetails />}
        />
        <Route
          path="/categories"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Categories />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/categories/add" element={<CategoryForm />} />
        <Route path="/categories/:categoryId/edit" element={<CategoryForm />} />
        <Route
          path="/clients"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Clients />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/clients/add" element={<ClientForm />} />
        <Route path="/clients/:clientId/edit" element={<ClientForm />} />

        <Route
          path="/methodPayments"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <MethodPayments />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/methodPayments/add" element={<MethodPaymentForm />} />
        <Route
          path="/methodPayments/:methodPaymentId/edit"
          element={<MethodPaymentForm />}
        />

        <Route
          path="/"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Sales />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/add" element={<SaleForm />} />
        <Route path="/:saleId/edit" element={<SaleForm />} />
        <Route path="/:saleId/details" element={<SaleDetails />} />
        <Route
          path="/debts"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Debts />
              </GridItem>
            </Grid>
          }
        />
        <Route path="/debts/add" element={<DebtForm />} />
        <Route path="/debts/:debtId/edit" element={<DebtForm />} />
        <Route
          path="/reports"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10} mt={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                {/* <Card variant="outline" mb={3}> */}
                {/* <CardBody> */}
                <BarChart />
                {/* </CardBody> */}
                {/* </Card> */}
              </GridItem>
            </Grid>
          }
        />
        <Route
          path="/products-sold"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10} mt={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <Card variant="outline" mb={3}>
                  <CardBody>
                    <HistorySales />
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          }
        />
        <Route
          path="/*"
          element={
            <Grid templateColumns="repeat(12, 1fr)" mb={10} mt={10}>
              <GridItem
                as="main"
                colSpan={{ base: 10, md: 10, lg: 8 }}
                colStart={{ base: 2, md: 2, lg: 3 }}
                mb={10}
              >
                <PageNotFound />
              </GridItem>
            </Grid>
          }
        />
      </Routes>
      <Tabs
        index={tabsIndex.get(pathName)}
        position={"fixed"}
        bgColor={"purple.500"}
        color={"white"}
        bottom={0}
        zIndex={5}
        isFitted
        width={"100%"}
        variant="line"
        py={2}
        display={{ md: "none" }}
      >
        <TabList border={"none"}>
          <Tab
            boxSize={"14"}
            mx={1}
            _selected={{ bgColor: "purple.600", borderRadius: "10px" }}
            outlineColor={"none"}
            fontSize={"smaller"}
            color={"white"}
            onClick={() => goToSales()}
          >
            <Flex direction={"column"} alignItems={"center"}>
              <FaHouse size={20} />
              <Text>Inicio</Text>
            </Flex>
          </Tab>
          <Tab
            boxSize={"14"}
            mx={1}
            _selected={{ bgColor: "purple.600", borderRadius: "10px" }}
            fontSize={"smaller"}
            color={"white"}
            onClick={() => goToDebts()}
          >
            <Flex direction={"column"} alignItems={"center"}>
              <FaMoneyCheckDollar size={20} />
              <Text>Deudas</Text>
            </Flex>
          </Tab>
          <Tab
            mx={1}
            boxSize={"14"}
            _selected={{ bgColor: "purple.600", borderRadius: "10px" }}
            fontSize={"smaller"}
            color={"white"}
            onClick={() => goToProducts()}
          >
            <Flex direction={"column"} alignItems={"center"}>
              <FaBoxesStacked size={20} />
              <Text>Productos</Text>
            </Flex>
          </Tab>
          <Tab
            mx={1}
            boxSize={"14"}
            _selected={{ bgColor: "purple.600", borderRadius: "10px" }}
            fontSize={"smaller"}
            color={"white"}
            onClick={() => goToClients()}
          >
            <Flex direction={"column"} alignItems={"center"}>
              <FaUsers size={20} />
              <Text>Clientes</Text>
            </Flex>
          </Tab>
          <Tab
            mx={1}
            boxSize={"14"}
            _selected={{ bgColor: "purple.600", borderRadius: "10px" }}
            fontSize={"smaller"}
            color={"white"}
            onClick={() => goToCategories()}
          >
            <Flex direction={"column"} alignItems={"center"}>
              <FaTags size={20} />
              <Text>Categorias</Text>
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
    </>
  );
};

export default Home;
