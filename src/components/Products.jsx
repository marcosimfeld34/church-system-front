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
import { useProductContext } from "../hooks/useProductContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Products = () => {
  const { getProducts } = useProductContext();

  const [searchValue, setSearchValue] = useState("");

  const { user } = useAuthContext();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const navigate = useNavigate();

  const totalProductSales = products
    ?.map((product) => product.salePrice * product.stock)
    .reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const totalProductCost = products
    ?.map((product) => product.costPrice * product.stock)
    .reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const handleAddProduct = () => {
    navigate("add");
  };

  const handleSetSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const productList = products
    ?.filter((product) => product.name.toLowerCase().includes(searchValue))
    ?.map((product) => {
      return <Product key={product._id} product={product} />;
    });

  return (
    <>
      {isLoading && (
        <Card variant="outline" mt={5}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}
      {!isLoading && (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
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
        </Grid>
      )}
      <Card variant="filled" mt={5} mb={3}>
        <CardBody>
          <Flex>
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

      {isLoading && (
        <>
          <Card
            variant="outline"
            mb={3}
            mt={user.profile !== "System Administrator" ? 5 : 0}
          >
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

      {products?.length > 0 && !isLoading && (
        <Grid mt={user.profile !== "System Administrator" ? 5 : 0}>
          {productList}
        </Grid>
      )}
      {products?.length === 0 && !isLoading && (
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
