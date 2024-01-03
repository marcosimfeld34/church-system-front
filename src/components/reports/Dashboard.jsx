import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Stack,
  Skeleton,
} from "@chakra-ui/react";

import { useMemo } from "react";

import SimpleBoard from "./SimpleBoard";

const Dashboard = ({ querySales, querySaleDetails, queryProducts }) => {
  const saleDetails = querySaleDetails?.data;
  const sales = querySales?.data;
  const products = queryProducts?.data;

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

  const totalProductSales = useMemo(
    () =>
      products
        ?.map((product) => product.salePrice * product.stock)
        .reduce((acc, currentValue) => acc + currentValue, 0)
        .toFixed(2),
    [products]
  );

  const totalProductCost = useMemo(
    () =>
      products
        ?.map((product) => product.costPrice * product.stock)
        .reduce((acc, currentValue) => acc + currentValue, 0)
        .toFixed(2),
    [products]
  );

  const totalProductProfit = useMemo(
    () => totalProductSales - totalProductCost,
    [totalProductSales, totalProductCost]
  );

  return (
    <>
      {querySales?.isLoading && (
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
      {!querySales?.isLoading && !products && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} gap={2} mt={5}>
          <GridItem colSpan={{ base: 12, md: 4 }} colStart={{ base: 1, md: 1 }}>
            <SimpleBoard
              amount={totalSalesAmount}
              size={querySaleDetails?.data}
              title={"Facturación total"}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }} colStart={{ base: 1, md: 5 }}>
            <SimpleBoard
              amount={totalCostSold}
              size={querySaleDetails?.data}
              title={"Costo total"}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }} colStart={{ base: 1, md: 9 }}>
            <SimpleBoard
              amount={totalProfit}
              size={querySaleDetails?.data}
              title={"Ganancia total"}
            />
          </GridItem>
        </Grid>
      )}
      {!queryProducts?.isLoading && products && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} gap={2} mt={5}>
          <GridItem colSpan={{ base: 12, md: 4 }} colStart={{ base: 1, md: 1 }}>
            <SimpleBoard
              amount={totalProductSales}
              size={queryProducts?.data}
              title={"Monto total en stock"}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }} colStart={{ base: 1, md: 5 }}>
            <SimpleBoard
              amount={totalProductCost}
              size={queryProducts?.data}
              title={"Costo del stock"}
            />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }} colStart={{ base: 1, md: 9 }}>
            <SimpleBoard
              amount={totalProductProfit}
              size={queryProducts?.data}
              title={"Ganancia del stock"}
            />
          </GridItem>
        </Grid>
      )}
    </>
  );
};

export default Dashboard;
