import {
  Grid,
  Card,
  CardBody,
  Flex,
  Text,
  Stack,
  Skeleton,
} from "@chakra-ui/react";

import { useMemo } from "react";

// custom hooks
// import { useSaleDetails } from "../hooks/useSaleDetails";
// import { useSales } from "../hooks/useSales";

const Dashboard = ({ querySales, querySaleDetails }) => {
  // const querySales = useSales();
  // const querySaleDetails = useSaleDetails();

  const saleDetails = querySaleDetails?.data;
  const sales = querySales?.data;

  const totalCostSold = useMemo(
    () =>
      saleDetails
        ?.filter((saleDetail) => saleDetail.product !== null)
        ?.map(
          (saleDetail) => saleDetail?.product?.costPrice * saleDetail?.quantity
        )
        ?.reduce((acc, currentValue) => acc + currentValue, 0),
    [saleDetails]
  );

  const totalSalesAmount = useMemo(
    () =>
      sales
        ?.map((sale) => sale?.total)
        ?.reduce((acc, currentValue) => acc + currentValue, 0)
        .toFixed(2),
    [sales]
  );

  const totalProfit = useMemo(
    () => totalSalesAmount - totalCostSold,
    [totalSalesAmount, totalCostSold]
  );

  return (
    <>
      {querySales.isLoading && (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={2}
          mt={5}
          mb={3}
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
      {!querySales?.isLoading && (
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
                      }).format(
                        querySaleDetails?.data?.length > 0
                          ? totalSalesAmount
                          : 0
                      )
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
                      }).format(
                        querySaleDetails?.data?.length > 0 ? totalCostSold : 0
                      )
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
                      }).format(
                        querySaleDetails?.data?.length > 0 ? totalProfit : 0
                      )
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
    </>
  );
};

export default Dashboard;
