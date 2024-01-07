import { Grid, GridItem, Card, CardBody, Text, Flex } from "@chakra-ui/react";

const HistorySale = ({ saleDetail }) => {
  return (
    <GridItem colSpan="5" mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="md" align="start">
                  Producto:{" "}
                  <Text as={"span"} fontWeight={"500"}>
                    {saleDetail?.product?.name}
                  </Text>
                </Text>
              </Flex>
              <Text fontSize="md">
                Cantidad:{" "}
                <Text as={"span"} fontWeight={"500"}>
                  {saleDetail?.quantity}
                </Text>
              </Text>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                <Text as="b" alignSelf="end">
                  {saleDetail?.subtotal
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(saleDetail?.subtotal)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default HistorySale;
