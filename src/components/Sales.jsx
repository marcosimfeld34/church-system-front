import {
  Grid,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Text,
  Stack,
  Skeleton,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  GridItem,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";

import { useNavigate, useLocation } from "react-router-dom";

// formik
import { useFormik } from "formik";

import * as Yup from "yup";

// components
import Sale from "./Sale";
import Dashboard from "./Dashboard";

// custom hooks
import { useSaleDetails } from "../hooks/useSaleDetails";
import { useDebts } from "../hooks/useDebts";
import { useSales } from "../hooks/useSales";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";
import { useState } from "react";

const Sales = () => {
  const [showFilters, setShowFilters] = useState(
    JSON.parse(window.localStorage.getItem("showFilters"))?.showFilters
  );
  const { query: querySales, setRangeDateFilter } = useSales();
  const {
    query: querySaleDetails,
    setRangeDateFilter: setRangeDateFilterSaleDetail,
  } = useSaleDetails({ all: false });

  const queryDebts = useDebts();
  const { showMessage } = useMessage();

  const { logout } = useLogout();

  const navigate = useNavigate();
  const location = useLocation();

  const handleAddSale = () => {
    navigate("/add");
  };

  const sales = querySales?.data;

  const saleDetails = querySaleDetails?.data;

  const debts = queryDebts?.data;

  if (querySales?.isError && querySales?.error?.response?.status === 403) {
    logout().then((res) => {
      if (res.loggedOut) {
        showMessage("Venció la sesión", "success", "purple");
        navigate("/login", { state: { from: location }, replace: true });
      }
    });
  }

  const RangeDateFilterSchema = Yup.object().shape({
    startDate: Yup.string().required("Requerido"),
    endDate: Yup.string().required("Requerido"),
  });

  const handleOnSubmit = (e) => {
    e.preventDefault();
    formik.values.startDate;

    setRangeDateFilter({
      startDate: formik.values.startDate,
      endDate: formik.values.endDate,
    });

    setRangeDateFilterSaleDetail({
      startDate: formik.values.startDate,
      endDate: formik.values.endDate,
    });

    window.localStorage.setItem(
      "filters",
      JSON.stringify({
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
      })
    );
  };

  const today = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const filters = JSON.parse(window.localStorage.getItem("filters"));

  const formik = useFormik({
    initialValues: filters
      ? { ...filters }
      : {
          startDate: today,
          endDate: today,
        },
    validationSchema: RangeDateFilterSchema,
    onSubmit: handleOnSubmit,
  });

  const handleResetFilters = () => {
    window.localStorage.setItem(
      "filters",
      JSON.stringify({
        startDate: today,
        endDate: today,
      })
    );

    formik.setValues({
      startDate: today,
      endDate: today,
    });
  };

  const saleList = sales?.map((sale) => {
    return (
      <Sale
        key={sale?._id + sale?.createdAt}
        sale={sale}
        saleDetails={saleDetails?.filter(
          (saleDetail) => saleDetail.sale === sale._id
        )}
        debt={debts?.filter((debt) => debt?.sale?._id === sale._id)[0]}
      />
    );
  });

  const handleToggle = () => {
    if (showFilters) {
      setShowFilters(false);
      window.localStorage.setItem(
        "showFilters",
        JSON.stringify({ showFilters: false })
      );
    } else {
      setShowFilters(true);
      window.localStorage.setItem(
        "showFilters",
        JSON.stringify({ showFilters: true })
      );
    }
  };

  return (
    <>
      {querySales?.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}
      {!querySales?.isError && !querySales?.isLoading && (
        <Dashboard
          querySales={querySales}
          querySaleDetails={querySaleDetails}
        />
      )}

      {!querySales?.isError && !querySales?.isLoading && (
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {saleList?.length} ventas
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddSale()}
                colorScheme="purple"
                variant="solid"
              >
                <AddIcon boxSize={3} me={2} />
                Nueva venta
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

      {querySales?.isLoading && (
        <>
          <Card variant="filled" mb={3}>
            <CardBody>
              <Flex>
                <Spacer />
                <Skeleton
                  width={"170px"}
                  startColor="purple.500"
                  endColor="purple.300"
                  height="40px"
                  borderRadius={"5px"}
                />
              </Flex>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
        </>
      )}

      <Grid gap={2} templateColumns="repeat(12, 1fr)">
        <GridItem
          colSpan={{ base: 12, md: 12, lg: 9 }}
          colStart={{ base: 1, md: 1, lg: 4 }}
          justifySelf={"end"}
        >
          {!querySales?.isLoading && (
            <Button
              display={{ base: "block" }}
              variant={"ghost"}
              onClick={() => handleToggle()}
            >
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </Button>
          )}
        </GridItem>
        {showFilters && (
          <GridItem
            colSpan={{ base: 12, md: 12, lg: 3 }}
            colStart={{ base: 1, md: 1, lg: 1 }}
          >
            {!querySales?.isError && !querySales?.isLoading && (
              <Card variant="outline">
                <CardBody>
                  <form noValidate onSubmit={handleOnSubmit}>
                    <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={2}>
                      <GridItem colSpan={{ base: 12, md: 6, lg: 12 }}>
                        <FormControl>
                          <FormLabel htmlFor="startDate">Desde:</FormLabel>
                          <Input
                            name="startDate"
                            id="startDate"
                            type="date"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            placeholder="Fecha desde"
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={{ base: 12, md: 6, lg: 12 }}>
                        <FormControl mb={2}>
                          <FormLabel htmlFor="endDate">Hasta:</FormLabel>
                          <Input
                            name="endDate"
                            id="endDate"
                            type="date"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            placeholder="Fecha hasta"
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                    <Stack
                      direction={{ base: "row", lg: "column", xl: "row" }}
                      justifyContent={"space-between"}
                    >
                      <Button
                        type="submit"
                        colorScheme="purple"
                        variant="solid"
                      >
                        <SearchIcon boxSize={3} me={2} />
                        Buscar
                      </Button>
                      <Button
                        onClick={() => handleResetFilters()}
                        colorScheme="gray"
                        variant="solid"
                      >
                        Reiniciar
                      </Button>
                    </Stack>
                  </form>
                </CardBody>
              </Card>
            )}
          </GridItem>
        )}
        <GridItem
          colSpan={{ base: 12, md: 12, lg: showFilters ? 9 : 12 }}
          colStart={{ base: 1, md: 1, lg: showFilters ? 4 : 1 }}
        >
          {querySales?.data?.length > 0 &&
            !querySales?.isLoading &&
            !querySales?.isError && <>{saleList}</>}
          {querySales?.data?.length === 0 &&
            !querySales?.isError &&
            !querySales?.isLoading && (
              <Card variant="outline">
                <CardBody>
                  <Alert colorScheme="purple" status="success">
                    <AlertIcon />
                    No se encontró resultados.
                  </Alert>
                </CardBody>
              </Card>
            )}
        </GridItem>
      </Grid>
    </>
  );
};

export default Sales;
