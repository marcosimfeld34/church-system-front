import {
  Grid,
  Card,
  CardBody,
  Flex,
  Stack,
  Skeleton,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";

import Select from "react-select";
import { useState } from "react";

// custom hooks
import { useSaleDetails } from "../../hooks/useSaleDetails";
import { useCategories } from "../../hooks/useCategories";

// components
import HistorySale from "./HistorySale";
import WithoutResults from "../common/WithoutResults";

const HistorySales = () => {
  const [currentCategory, setCurrentCategory] = useState("");
  const {
    query: querySaleDetails,
    // setRangeDateFilter: setRangeDateFilterSaleDetail,
  } = useSaleDetails({ all: true });

  const queryCategories = useCategories();

  const categories = queryCategories?.data;

  const saleDetails = querySaleDetails?.data?.filter(
    (saleDetail) => saleDetail?.product?.category === currentCategory
  );

  const productSoldList = saleDetails?.map((saleDetail) => {
    return <HistorySale key={saleDetail._id} saleDetail={saleDetail} />;
  });

  const totalAmount = saleDetails
    ?.map((saleDetail) => saleDetail.subtotal)
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const handleSelectCategories = (option) => {
    setCurrentCategory(option?.value ? option?.value : "");
  };

  const categoriesOptions = categories?.map((client) => {
    return { label: client.name, value: client._id };
  });

  return (
    <>
      {querySaleDetails?.isLoading && (
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
      {!querySaleDetails.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Flex direction={"column"}>
              <Text>Total</Text>
              {currentCategory === "" && (
                <Text fontSize={"2xl"} as="b">
                  {totalAmount && currentCategory === ""
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(totalAmount)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              )}
              {currentCategory !== "" && (
                <Text fontSize={"2xl"} as="b">
                  {totalAmount && currentCategory !== ""
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(totalAmount)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              )}
            </Flex>
          </CardBody>
        </Card>
      )}
      <Card variant="outline" mt={5} mb={3}>
        <CardBody>
          <Flex>
            <FormControl>
              <FormLabel htmlFor="category">Filtrar por categoria:</FormLabel>
              <Select
                options={categoriesOptions}
                onChange={handleSelectCategories}
                noOptionsMessage={() => "No hay categorias"}
                isClearable={true}
                name="category"
                id="category"
                placeholder="Libros, etc ..."
              />
            </FormControl>
          </Flex>
        </CardBody>
      </Card>

      {querySaleDetails?.isLoading && (
        <>
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

      {productSoldList?.length > 0 && !querySaleDetails?.isLoading && (
        <Grid>{productSoldList}</Grid>
      )}
      {productSoldList?.length === 0 && !querySaleDetails?.isLoading && (
        <WithoutResults text={"No se encontró resultados."} />
      )}
    </>
  );
};

export default HistorySales;
