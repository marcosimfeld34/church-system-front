import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
  Button,
  Spacer,
  Divider,
  Box,
  Stack,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from "@chakra-ui/react";

import { useNavigate, useParams } from "react-router-dom";

import { EditIcon, ChevronLeftIcon } from "@chakra-ui/icons";

// custom hooks
import { useSaleDetails } from "../hooks/useSaleDetails";
import { useSales } from "../hooks/useSales";

const SaleDetails = () => {
  const { saleId } = useParams();

  const { query: querySales } = useSales();

  const sale = querySales?.data?.filter((sale) => sale._id === saleId)[0];

  const { query: querySaleDetails } = useSaleDetails({ all: false });

  const saleDetails = querySaleDetails?.data?.filter(
    (saleDetail) => saleDetail?.sale === saleId
  );

  const saleDetailsList = saleDetails?.map((saleDetail) => {
    return (
      <Tr key={saleDetail._id}>
        <Td>{saleDetail.product.name}</Td>
        <Td>{saleDetail.quantity}</Td>
        <Td isNumeric>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            minimumFractionDigits: 2,
            currency: "USD",
          }).format(saleDetail.subtotal)}
        </Td>
      </Tr>
    );
  });

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const handleEditProduct = () => {
    navigate(`/${sale._id}/edit`);
  };

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
        <GridItem
          mt={1}
          colSpan={{ base: 10, lg: 8 }}
          colStart={{ base: 2, lg: 3 }}
        >
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex>
                <Button
                  onClick={() => handleGoBack()}
                  colorScheme="blue"
                  variant="outline"
                >
                  <ChevronLeftIcon boxSize={4} me={1} />
                  Volver
                </Button>
                <Spacer />
                <Button
                  onClick={() => handleEditProduct()}
                  colorScheme="purple"
                  variant="solid"
                >
                  <EditIcon boxSize={3} me={2} />
                  Editar
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        {querySales?.isLoading && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  alignItems="center"
                >
                  <GridItem colSpan={6}>
                    <Stack>
                      <Skeleton height="50px" />
                      <Box padding="3">
                        <Divider />
                      </Box>
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                    </Stack>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}
        {!querySales?.isLoading && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  alignItems="center"
                >
                  <GridItem colSpan={6}>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Cliente: </Text>
                      <Text as="b" fontSize="lg">
                        {sale?.client?.name}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Pagado: </Text>
                      <Text as="b" fontSize="lg">
                        {sale?.isPaid ? (
                          <Badge colorScheme="green">Si</Badge>
                        ) : (
                          <Badge colorScheme="red">No</Badge>
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Total: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "USD",
                        }).format(sale?.total.toFixed(2))}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Vendedor: </Text>
                      <Text as="b" fontSize="lg">
                        {sale.createdBy.firstName} {sale.createdBy.lastName}
                      </Text>
                    </Flex>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {!querySales?.isLoading && (
          <GridItem
            mt={3}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Producto</Th>
                        <Th>Cantidad</Th>
                        <Th isNumeric>Subtotal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>{saleDetailsList}</Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Total</Th>
                        <Th></Th>
                        <Th isNumeric>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "USD",
                          }).format(
                            saleDetails
                              ?.map((saleDetail) => saleDetail?.subtotal)
                              .reduce(
                                (acc, currentValue) => acc + currentValue,
                                0
                              )
                          )}
                        </Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </>
  );
};

export default SaleDetails;
