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
} from "@chakra-ui/react";

import { useNavigate, useParams } from "react-router-dom";

import { EditIcon, ChevronLeftIcon } from "@chakra-ui/icons";

// custom hooks
import { useProducts } from "../../hooks/useProducts";

const ProductDetails = () => {
  const { productId } = useParams();

  const queryProducts = useProducts({ id: productId });

  const product = queryProducts?.data ? { ...queryProducts?.data[0] } : {};

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/products");
  };

  const handleEditProduct = () => {
    navigate(`/products/${product._id}/edit`);
  };

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
        <GridItem
          m={1}
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
        {queryProducts?.isLoading && (
          <GridItem
            m={1}
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
        {!queryProducts?.isLoading && (
          <GridItem
            m={1}
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
                    <Flex direction="row" justifyContent={"center"}>
                      <Text fontSize="3xl">{product?.name}</Text>
                    </Flex>
                    <Box padding="5">
                      <Divider />
                    </Box>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Precio venta: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "ARS",
                        }).format(product?.salePrice.toFixed(2))}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Precio costo: </Text>
                      <Text as="b" fontSize="lg">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "ARS",
                        }).format(product?.costPrice.toFixed(2))}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Porcentaje %: </Text>
                      <Text as="b" fontSize="lg">
                        {product?.salePorcentage.toFixed(2)}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Stock: </Text>
                      <Text as="b" fontSize="lg">
                        {product?.stock}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Categoria: </Text>
                      <Text as="b" fontSize="lg">
                        {product?.category.name}
                      </Text>
                    </Flex>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </>
  );
};

export default ProductDetails;
