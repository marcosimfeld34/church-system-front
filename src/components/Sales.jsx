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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useNavigate, useLocation } from "react-router-dom";

// components
import Sale from "./Sale";
import Dashboard from "./Dashboard";

// custom hooks
import { useSaleDetails } from "../hooks/useSaleDetails";
import { useDebts } from "../hooks/useDebts";
import { useSales } from "../hooks/useSales";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";

const Sales = () => {
  const querySales = useSales();
  const querySaleDetails = useSaleDetails();
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

      {querySales?.data?.length > 0 &&
        !querySales?.isLoading &&
        !querySales?.isError && <Grid>{saleList}</Grid>}
      {querySales?.data?.length === 0 &&
        !querySales?.isError &&
        !querySales?.isLoading && (
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Alert colorScheme="purple" status="success">
                <AlertIcon />
                No hay ventas.
              </Alert>
            </CardBody>
          </Card>
        )}
    </>
  );
};

export default Sales;
