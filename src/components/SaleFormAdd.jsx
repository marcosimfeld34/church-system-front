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
  Text,
  Link,
  Divider,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";

import { DeleteIcon } from "@chakra-ui/icons";

import Select from "react-select";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

const SaleFormAdd = (props) => {
  const { onSubmit, onCancelOperation, products, clients } = props;
  const toast = useToast();
  // const navigate = useNavigate();

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
      client: "",
      isPaid: true,
      isLoading: false,
      saleItems: [{ product: "", quantity: "" }],
    },
    validationSchema: SaleSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
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
    formik.setFieldValue(`saleItems[${index}].product`, value.value);
  };

  const handleSelectClient = ({ value }) => {
    formik.setFieldValue("client", value);
  };

  const handleAddRow = () => {
    formik.setFieldValue("saleItems", [
      ...formik.values.saleItems,
      { product: "", quantity: "" },
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

  const productsOptions = products?.map((product) => {
    return { label: product.name, value: product._id, stock: product.stock };
  });

  const clientsOptions = clients?.map((client) => {
    return { label: client.name, value: client._id };
  });

  return (
    <>
      <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
        <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
          <Card mb={3} variant="outline">
            <CardBody>
              <Heading mb={3} textAlign="center" size="lg">
                Nueva venta:
              </Heading>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={formik.errors.client}>
                      <FormLabel>Nombre cliente:</FormLabel>
                      <Select
                        options={clientsOptions}
                        onChange={handleSelectClient}
                        name="client"
                        placeholder="Buscar cliente"
                        noOptionsMessage={() => "No hay clientes"}
                        isInvalid={
                          formik.errors.client && formik.touched.client
                        }
                        required
                      />
                      <Link color="teal.500" href="/clients/add">
                        Agregar nuevo cliente
                      </Link>
                      <FormErrorMessage>
                        {formik.errors.client}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>

                <Grid mb={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Pagado?</FormLabel>
                      <Checkbox
                        name="isPaid"
                        type="checkbox"
                        value={formik.values.isPaid}
                        defaultChecked={formik.values.isPaid}
                        onChange={formik.handleChange}
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
                                    value={productsOptions?.filter(
                                      (product) =>
                                        product.value ===
                                        formik?.values?.saleItems[index]
                                          ?.product
                                    )}
                                    placeholder="Buscar producto"
                                    required
                                  />
                                  <FormErrorMessage>
                                    {
                                      formik?.errors?.saleItems?.at(index)
                                        ?.product
                                    }
                                  </FormErrorMessage>
                                </FormControl>
                                <FormControl
                                  isInvalid={
                                    formik?.errors?.saleItems?.at(index)
                                      ?.quantity
                                  }
                                >
                                  <Input
                                    name={`saleItems[${index}].quantity`}
                                    type="number"
                                    value={
                                      formik.values.saleItems[index].quantity
                                    }
                                    onChange={formik.handleChange}
                                    placeholder="Cantidad"
                                    required
                                  />
                                  <FormErrorMessage>
                                    {
                                      formik?.errors?.saleItems?.at(index)
                                        ?.quantity
                                    }
                                  </FormErrorMessage>
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
                    Guardar
                  </Button>
                </HStack>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};

export default SaleFormAdd;
