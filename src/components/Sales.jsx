import { useQuery } from "react-query";

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

import { useNavigate } from "react-router-dom";

// components
import Sale from "./Sale";

// custom hooks
import { useSaleContext } from "../hooks/useSaleContext";
import { useSaleDetailContext } from "../hooks/useSaleDetailContext";
import { useDebtContext } from "../hooks/useDebtContext";

const Sales = () => {
  const { getSales } = useSaleContext();
  const { getSaleDetails } = useSaleDetailContext();
  const { getDebts } = useDebtContext();

  const { data: saleDetails } = useQuery({
    queryKey: ["saleDetails"],
    queryFn: getSaleDetails,
  });

  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  const { data: debts } = useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
  });

  const navigate = useNavigate();

  const handleAddSale = () => {
    navigate("/add");
  };

  const totalCostSold = saleDetails
    ?.map((saleDetail) => saleDetail.product.costPrice * saleDetail.quantity)
    ?.reduce((acc, currentValue) => acc + currentValue, 0);

  const totalSalesAmount = sales
    ?.map((sale) => sale?.total)
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const totalProfit = totalSalesAmount - totalCostSold;

  const saleList = sales?.map((sale) => {
    return (
      <Sale
        key={sale._id}
        sale={sale}
        saleDetails={saleDetails?.filter(
          (saleDetail) => saleDetail.sale === sale._id
        )}
        debt={debts?.filter((debt) => debt.sale._id === sale._id)[0]}
      />
    );
  });

  return (
    <>
      {isLoading && (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={2}
          mt={5}
        >
          <Card variant="outline">
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline">
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline">
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      )}
      {!isLoading && (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={2}
          mt={5}
        >
          <Card variant="outline">
            <CardBody>
              <Flex direction={"column"}>
                <Text>Facturación total</Text>
                <Text fontSize={"2xl"} as="b">
                  {totalSalesAmount
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(saleDetails?.length > 0 ? totalSalesAmount : 0)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              </Flex>
            </CardBody>
          </Card>
          <Card variant="outline">
            <CardBody>
              <Flex direction={"column"}>
                <Text>Costo total</Text>
                <Text fontSize={"2xl"} as="b">
                  {totalCostSold
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(saleDetails?.length > 0 ? totalCostSold : 0)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              </Flex>
            </CardBody>
          </Card>
          <Card variant="outline">
            <CardBody>
              <Flex direction={"column"}>
                <Text>Ganancia total</Text>
                <Text fontSize={"2xl"} as="b">
                  {totalProfit
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(saleDetails?.length > 0 ? totalProfit : 0)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </Grid>
      )}

      <Card variant="filled" mt={5} mb={3}>
        <CardBody>
          <Flex>
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

      {isLoading && (
        <>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
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
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
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
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            </CardBody>
          </Card>
        </>
      )}

      {sales?.length > 0 && !isLoading && <Grid>{saleList}</Grid>}
      {sales?.length === 0 && !isLoading && (
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
