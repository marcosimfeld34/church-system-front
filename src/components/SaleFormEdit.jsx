import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  HStack,
  Checkbox,
  Flex,
  SimpleGrid,
  IconButton,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";
import Select from "react-select";
import * as Yup from "yup";

import { useQuery } from "react-query";

// formik
import { useFormik } from "formik";

// hooks
import { useSaleDetailContext } from "../hooks/useSaleDetailContext";

// services
import saleDetailService from "../services/saleDetails";
import productService from "../services/product";

const SaleFormEdit = (props) => {
  const { onSubmit, onCancelOperation, products, clients, saleToUpdate } =
    props;

  const toast = useToast();

  const { getSaleDetails } = useSaleDetailContext();

  const { data: saleDetails } = useQuery({
    queryKey: ["saleDetails"],
    queryFn: getSaleDetails,
  });

  const SaleSchema = Yup.object().shape({
    client: Yup.string().required("Requerido"),
    saleItems: Yup.array(
      Yup.object().shape({
        product: Yup.string().required("Requerido"),
        quantity: Yup.number()
          .min(0, "Debe ser mayor o igual a cero.")
          .required("Requerido"),
        id: Yup.string(),
      })
    ),
  });

  const saleItemInitialByProductId = new Map();
  const saleItemInitial = [];
  saleDetails?.filter((saleDetail) => {
    if (saleDetail.sale === saleToUpdate._id) {
      saleItemInitial.push({
        product: saleDetail.product._id,
        quantity: saleDetail.quantity,
        id: saleDetail._id,
      });
      saleItemInitialByProductId.set(
        saleDetail.product._id,
        saleDetail.quantity
      );
    }
  });

  const formik = useFormik({
    initialValues: {
      client: saleToUpdate?.client?._id || "",
      isPaid: saleToUpdate !== undefined ? saleToUpdate?.isPaid : false,
      isLoading: false,
      saleItems: saleItemInitial,
    },
    validationSchema: SaleSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const productsWithoutStock = [];

      formik.values.saleItems?.forEach((saleItem, index) => {
        products?.forEach((product) => {
          if (
            product._id === saleItem.product &&
            saleItem.quantity !== saleItemInitialByProductId.get(product._id) &&
            product.stock + (saleItemInitialByProductId.get(product._id) || 0) <
              saleItem.quantity
          ) {
            productsWithoutStock.push(saleItem);

            formik.setFieldError(
              `saleItems[${index}].quantity`,
              `${
                saleItemInitialByProductId.get(product._id) || 0
              } (Cantidad inicial) + ${product.stock} (stock disponible) = ${
                (saleItemInitialByProductId.get(product._id) || 0) +
                product.stock
              } (Máximo)`
            );
          }
        });
      });

      if (productsWithoutStock.length > 0) {
        toast({
          title: "No se puede guardar.",
          description: `Hay productos que superan el stock`,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } else {
        formik.setFieldValue("isLoading", true);
        onSubmit(values);
      }
    },
  });

  const subtotales = [];
  products?.forEach((product) => {
    formik?.values?.saleItems?.map((saleItem) => {
      if (saleItem?.product === product?._id) {
        subtotales.push(saleItem.quantity * product.salePrice);
      }
    });
  });

  const total = subtotales?.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );

  const handleSelectProduct = (value, index) => {
    formik.setFieldValue(
      `saleItems[${index}].product`,
      value?.value ? value.value : ""
    );
  };

  const handleSelectClient = (options) => {
    formik.setFieldValue("client", options?.value ? options?.value : "");
  };

  const handleAddRow = () => {
    formik.setFieldValue("saleItems", [
      ...formik.values.saleItems,
      { product: "", quantity: "" },
    ]);
  };

  const handleRemoveRow = async (index) => {
    const filteredProducts = [];
    formik.values.saleItems.forEach((saleItem, currentIndex) => {
      if (currentIndex !== index) {
        filteredProducts.push(saleItem);
      }
    });

    const saleItemsToDelete = [];
    formik.values.saleItems.forEach((saleItem, currentIndex) => {
      if (currentIndex === index) {
        saleItemsToDelete.push(saleItem);
      }
    });

    const saleDetailProducts = [];
    saleDetails.forEach((saleDetail) => {
      saleDetailProducts.push(saleDetail.product);
    });

    const productsToUpdate = [];
    saleItemsToDelete.forEach((saleItemToDelete) => {
      saleDetailProducts.forEach((saleDetailProduct) => {
        if (saleDetailProduct._id === saleItemToDelete.product) {
          productsToUpdate.push(saleDetailProduct);
        }
      });
    });

    saleItemsToDelete.forEach((saleItemToDelete) => {
      productsToUpdate.forEach((productToUpdate) => {
        if (saleItemToDelete.product === productToUpdate._id) {
          productToUpdate.stock =
            productToUpdate.stock + saleItemToDelete.quantity;
        }
      });
    });

    const uniqByKeepLast = (data, key) => {
      return [...new Map(data.map((x) => [key(x), x])).values()];
    };

    let products = [];

    productsToUpdate.forEach((productToUpdate) => {
      products.push({
        id: productToUpdate._id,
        stock: productToUpdate.stock,
      });
    });

    products = uniqByKeepLast(products, (it) => it.id);

    await productService.updateMany({ products });

    await saleDetailService.deleteMany({
      saleDetails: saleItemsToDelete.map(
        (saleItemToDelete) => saleItemToDelete.id
      ),
    });

    formik.setFieldValue("saleItems", filteredProducts);
  };

  const handleProductBlur = (isTouched, index) => {
    formik.setFieldTouched(`saleItems[${index}].product`, isTouched);
  };

  const productsOptions = products?.map((product) => {
    return { label: product.name, value: product._id };
  });

  const clientsOptions = clients?.map((client) => {
    return { label: client.name, value: client._id };
  });

  return (
    <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5} mb={10}>
      <GridItem
        colSpan={{ base: 10, md: 8, lg: 8 }}
        colStart={{ base: 2, md: 3, lg: 3 }}
      >
        <Card mb={10} variant="outline">
          <CardBody>
            <Heading mb={3} textAlign="center" size="lg">
              Modificar venta:
            </Heading>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Grid mb={4}>
                <GridItem>
                  <FormControl
                    isInvalid={formik.errors.client && formik.touched.client}
                  >
                    <FormLabel htmlFor="client">Nombre cliente:</FormLabel>
                    <Select
                      options={clientsOptions}
                      onChange={handleSelectClient}
                      onBlur={(isTouched) =>
                        formik.setFieldTouched("client", isTouched)
                      }
                      isDisabled={formik.values.isLoading}
                      name="client"
                      id="client"
                      isClearable={true}
                      noOptionsMessage={() => "No hay clientes"}
                      value={clientsOptions?.filter(
                        (client) => client.value === formik.values.client
                      )}
                      placeholder="Buscar cliente ..."
                      isInvalid={formik.errors.client && formik.touched.client}
                      required
                    />
                    {formik.errors.client && formik.touched.client && (
                      <FormErrorMessage>
                        {formik.errors.client}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </GridItem>
              </Grid>

              <Grid mb={4}>
                <GridItem>
                  <FormControl>
                    <FormLabel htmlFor="isPaid">Pagado?</FormLabel>
                    {formik.values.isPaid !== undefined && (
                      <Checkbox
                        name="isPaid"
                        id="isPaid"
                        type="checkbox"
                        value={formik?.values?.isPaid}
                        isDisabled={formik.values.isLoading}
                        defaultChecked={formik?.values?.isPaid}
                        onChange={formik.handleChange}
                        colorScheme="purple"
                        placeholder="Pagado"
                      >
                        Si
                      </Checkbox>
                    )}
                  </FormControl>
                </GridItem>
              </Grid>
              <Grid mb={4}>
                <GridItem>
                  <FormControl>
                    <Divider orientation="horizontal" />
                  </FormControl>
                </GridItem>
              </Grid>
              <Grid mb={4}>
                <GridItem>
                  <FormControl>
                    <Text>
                      Total:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          minimumFractionDigits: 2,
                          currency: "ARS",
                        }).format(total || 0)}
                      </span>
                    </Text>
                  </FormControl>
                </GridItem>
              </Grid>
              <Grid mb={4}>
                <GridItem>
                  <FormControl>
                    <Divider orientation="horizontal" />
                  </FormControl>
                </GridItem>
              </Grid>

              {formik.values.saleItems.map((item, index) => {
                return (
                  <Flex key={index} direction={"column"} gap={2}>
                    <Card variant={"outline"} mb={2}>
                      <CardBody p="0">
                        <Grid templateColumns="repeat(6, 1fr)">
                          <GridItem colSpan={5}>
                            <SimpleGrid
                              columns={{ md: 2 }}
                              spacing="2"
                              p="2"
                              alignItems={"center"}
                            >
                              <FormControl
                                isInvalid={
                                  formik?.errors?.saleItems?.at(index)
                                    ?.product &&
                                  formik?.touched?.saleItems?.at(index)?.product
                                }
                              >
                                <Select
                                  options={productsOptions}
                                  onChange={(value) =>
                                    handleSelectProduct(value, index)
                                  }
                                  noOptionsMessage={() => "No hay productos"}
                                  value={productsOptions?.filter(
                                    (product) =>
                                      product.value ===
                                      formik?.values?.saleItems[index]?.product
                                  )}
                                  name={`saleItems[${index}].product`}
                                  id={`saleItems[${index}].product`}
                                  onBlur={(isTouched) =>
                                    handleProductBlur(isTouched, index)
                                  }
                                  isClearable={true}
                                  isDisabled={formik.values.isLoading}
                                  placeholder="Buscar producto ..."
                                  isInvalid={
                                    formik?.errors?.saleItems?.at(index)
                                      ?.product &&
                                    formik?.errors?.saleItems?.at(index)
                                      ?.product
                                  }
                                  required
                                />
                                {formik?.errors?.saleItems?.at(index)
                                  ?.product &&
                                  formik?.touched?.saleItems?.at(index)
                                    ?.product && (
                                    <FormErrorMessage>
                                      {
                                        formik?.errors?.saleItems?.at(index)
                                          ?.product
                                      }
                                    </FormErrorMessage>
                                  )}
                              </FormControl>
                              <FormControl
                                isInvalid={
                                  formik?.errors?.saleItems?.at(index)
                                    ?.quantity &&
                                  formik?.touched?.saleItems?.at(index)
                                    ?.quantity
                                }
                              >
                                <Input
                                  name={`saleItems[${index}].quantity`}
                                  id={`saleItems[${index}].quantity`}
                                  type="number"
                                  value={
                                    formik?.values?.saleItems[index]?.quantity
                                  }
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  isDisabled={formik.values.isLoading}
                                  placeholder="Cantidad"
                                  isInvalid={
                                    formik?.errors?.saleItems?.at(index)
                                      ?.quantity &&
                                    formik?.touched?.saleItems?.at(index)
                                      ?.quantity
                                  }
                                  required
                                />
                                {formik?.errors?.saleItems?.at(index)
                                  ?.quantity &&
                                  formik?.touched?.saleItems?.at(index)
                                    ?.quantity && (
                                    <FormErrorMessage>
                                      {
                                        formik?.errors?.saleItems?.at(index)
                                          ?.quantity
                                      }
                                    </FormErrorMessage>
                                  )}
                              </FormControl>
                              <Text>
                                Subtotal:{" "}
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  minimumFractionDigits: 2,
                                  currency: "ARS",
                                }).format(
                                  products?.filter((product) => {
                                    if (
                                      product?._id ===
                                      formik?.values?.saleItems?.at(index)
                                        .product
                                    ) {
                                      return product.salePrice;
                                    }
                                  })[0]?.salePrice *
                                    formik?.values?.saleItems?.at(index)
                                      .quantity || 0
                                )}
                              </Text>
                            </SimpleGrid>
                          </GridItem>
                          <GridItem
                            colSpan={1}
                            alignSelf={"center"}
                            justifySelf={"end"}
                          >
                            {formik?.values?.saleItems?.length > 1 && (
                              <IconButton
                                variant={"outline"}
                                colorScheme="red"
                                me={2}
                                onClick={() => handleRemoveRow(index)}
                                icon={<DeleteIcon />}
                              />
                            )}
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                    {formik?.values?.saleItems?.length - 1 === index && (
                      <Button
                        key={"addRows"}
                        variant="link"
                        size={"sm"}
                        colorScheme="messenger"
                        alignSelf={"start"}
                        onClick={() => handleAddRow()}
                      >
                        Agregar item
                      </Button>
                    )}
                  </Flex>
                );
              })}

              <HStack justifyContent={"end"} mt={6}>
                <Button
                  onClick={() => onCancelOperation()}
                  colorScheme="gray"
                  variant="solid"
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={formik.values.isLoading}
                  type="submit"
                  colorScheme="purple"
                  variant="solid"
                >
                  Actualizar
                </Button>
              </HStack>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default SaleFormEdit;
