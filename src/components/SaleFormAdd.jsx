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
  Stack,
  Checkbox,
  Flex,
  SimpleGrid,
  IconButton,
  Text,
  Link,
  Divider,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";

import Select from "react-select";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

import { useQueryClient } from "@tanstack/react-query";

const SaleFormAdd = (props) => {
  const { onSubmit, onCancelOperation } = props;

  const queryClient = useQueryClient();

  const products = queryClient.getQueryData(["products"]);
  const clients = queryClient.getQueryData(["clients"]);

  const toast = useToast();

  const SaleSchema = Yup.object().shape({
    client: Yup.string().required("Requerido"),
    saleItems: Yup.array(
      Yup.object().shape({
        product: Yup.string().required("Requerido"),
        quantity: Yup.number()
          .min(1, "Debe ser mayor o igual a uno.")
          .required("Requerido"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      client:
        clients?.filter((client) =>
          client?.name.toLowerCase().includes("consumidor")
        )[0]?._id || "",
      isPaid: true,
      isLoading: false,
      saleItems: [{ product: "", quantity: 1 }],
    },
    validationSchema: SaleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (formik.values.isLoading) return;

      const productsWithoutStock = [];

      formik.values.saleItems?.forEach((saleItem, index) => {
        products?.forEach((product) => {
          if (
            product._id === saleItem.product &&
            product.stock < saleItem.quantity
          ) {
            productsWithoutStock.push(saleItem);
            formik.setFieldError(
              `saleItems[${index}].quantity`,
              `Supera el stock: ${product.stock}`
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

        const error = await onSubmit(values);

        if (error === false) {
          formik.setFieldValue("isLoading", error);
        }
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
      { product: "", quantity: 1 },
    ]);
  };

  const handleRemoveRow = (index) => {
    const filteredProducts = [];
    formik.values.saleItems.forEach((saleItem, currentIndex) => {
      if (currentIndex !== index) {
        filteredProducts.push(saleItem);
      }
    });
    formik.setFieldValue("saleItems", filteredProducts);
  };

  const handleProductBlur = (isTouched, index) => {
    formik.setFieldTouched(`saleItems[${index}].product`, isTouched);
  };

  const productsOptions = products?.map((product) => {
    return { label: product.name, value: product._id, stock: product.stock };
  });

  const clientsOptions = clients?.map((client) => {
    return { label: client.name, value: client._id };
  });

  return (
    <>
      <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5} mb={10}>
        <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
          <Card mb={10} variant="outline">
            <CardBody>
              <Heading mb={3} textAlign="center" size="lg">
                Nueva venta:
              </Heading>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={formik.errors.client && formik.touched.client}
                    >
                      <FormLabel htmlFor="client">Nombre cliente:</FormLabel>
                      <Select
                        value={clientsOptions?.filter(
                          (client) => client.value === formik.values.client
                        )}
                        options={clientsOptions}
                        onChange={handleSelectClient}
                        onBlur={(isTouched) =>
                          formik.setFieldTouched("client", isTouched)
                        }
                        name="client"
                        id="client"
                        isClearable={true}
                        placeholder="Buscar cliente"
                        noOptionsMessage={() => "No hay clientes"}
                        isDisabled={formik.values.isLoading}
                        isInvalid={
                          formik.errors.client && formik.touched.client
                        }
                        required
                      />
                      <Link color="teal.500" href="/clients/add">
                        Agregar nuevo cliente
                      </Link>
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
                      <Checkbox
                        name="isPaid"
                        id="isPaid"
                        type="checkbox"
                        value={formik.values.isPaid}
                        defaultChecked={formik.values.isPaid}
                        onChange={formik.handleChange}
                        isDisabled={formik.values.isLoading}
                        colorScheme="purple"
                        placeholder="Pagado"
                      >
                        Si
                      </Checkbox>
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
                    <Flex key={index} direction={"column"} gap={1}>
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
                                    formik?.touched?.saleItems?.at(index)
                                      ?.product
                                  }
                                >
                                  <Select
                                    options={productsOptions}
                                    onChange={(value) =>
                                      handleSelectProduct(value, index)
                                    }
                                    noOptionsMessage={() => "No hay productos"}
                                    name={`saleItems[${index}].product`}
                                    id={`saleItems[${index}].product`}
                                    onBlur={(isTouched) =>
                                      handleProductBlur(isTouched, index)
                                    }
                                    isClearable={true}
                                    isDisabled={formik.values.isLoading}
                                    value={productsOptions?.filter(
                                      (product) =>
                                        product.value ===
                                        formik?.values?.saleItems[index]
                                          ?.product
                                    )}
                                    placeholder="Buscar producto"
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
                                      formik.values.saleItems[index].quantity
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
                          variant="ghost"
                          size={"sm"}
                          colorScheme="blue"
                          alignSelf={"start"}
                          onClick={() => handleAddRow()}
                        >
                          Agregar item
                        </Button>
                      )}
                    </Flex>
                  );
                })}

                <Stack
                  mt={6}
                  spacing={3}
                  direction={{ base: "column", md: "row" }}
                  justifyContent={"end"}
                >
                  <Button
                    isLoading={formik.values.isLoading}
                    type="submit"
                    colorScheme="purple"
                    variant="solid"
                  >
                    Guardar
                  </Button>
                  <Button
                    onClick={() => onCancelOperation()}
                    colorScheme="gray"
                    variant="solid"
                  >
                    Cancelar
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};

export default SaleFormAdd;
