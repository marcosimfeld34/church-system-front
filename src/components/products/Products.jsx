import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Text,
  Stack,
  Skeleton,
  FormControl,
  Alert,
  Input,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

// components
import Product from "./Product";

// custom hooks
import { useProducts } from "../../hooks/useProducts";
import { useError } from "../../hooks/useError";

const Products = () => {
  const [searchValue, setSearchValue] = useState("");

  const { throwError } = useError();

  const navigate = useNavigate();

  const queryProducts = useProducts();

  if (queryProducts?.isError) {
    throwError(queryProducts?.error);
  }

  const totalProductSales = queryProducts?.data
    ?.map((product) => product.salePrice * product.stock)
    .reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const totalProductCost = queryProducts?.data
    ?.map((product) => product.costPrice * product.stock)
    .reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const totalProfit = totalProductSales - totalProductCost;

  const handleAddProduct = () => {
    navigate("add");
  };

  const handleSetSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const products = queryProducts?.data;

  const productList = products
    ?.filter((product) =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    ?.map((product) => {
      return (
        <Product key={product?._id + product?.createdAt} product={product} />
      );
    });

  return (
    <>
      {queryProducts?.isLoading && (
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
      {!queryProducts?.isError && !queryProducts?.isLoading && (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={2}
          mt={5}
        >
          <Card variant="outline">
            <CardBody>
              <Flex direction={"column"}>
                <Text>Monto total en stock</Text>
                <Text fontSize={"2xl"} as="b">
                  {totalProductSales
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(totalProductSales)
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
                <Text>Costo del stock</Text>
                <Text fontSize={"2xl"} as="b">
                  {totalProductCost
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(totalProductCost)
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
                <Text>Ganancia del stock</Text>
                <Text fontSize={"2xl"} as="b">
                  {totalProductCost
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(totalProfit)
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
      {!queryProducts?.isError && !queryProducts?.isLoading && (
        <>
          <Card bgColor={"#373E68"} variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex placeItems={"center"}>
                <Text color={"white"} fontWeight={"bold"}>
                  {productList?.length} productos
                </Text>
                <Spacer />
                <Button
                  onClick={() => handleAddProduct()}
                  colorScheme="purple"
                  variant="solid"
                >
                  <AddIcon boxSize={3} me={2} />
                  Agregar producto
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex>
                <FormControl>
                  <Input
                    name="searchValue"
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSetSearchValue(e)}
                    placeholder="Buscar producto ..."
                    required
                  />
                </FormControl>
              </Flex>
            </CardBody>
          </Card>
        </>
      )}

      {queryProducts?.isLoading && (
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
          <Card variant="outline" mb={3} mt={5}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
        </>
      )}

      {!queryProducts?.isError &&
        queryProducts?.data?.length > 0 &&
        !queryProducts?.isLoading && (
          <Grid mt={5}>
            <GridItem>{productList}</GridItem>
          </Grid>
        )}
      {!queryProducts?.isError &&
        queryProducts?.data?.length === 0 &&
        !queryProducts?.isLoading && (
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Alert colorScheme="purple" status="success">
                <AlertIcon />
                No hay productos cargados.
              </Alert>
            </CardBody>
          </Card>
        )}
    </>
  );
};

export default Products;
