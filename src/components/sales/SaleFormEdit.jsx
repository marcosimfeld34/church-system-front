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
  Divider,
  Text,
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";
import Select from "react-select";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

// hooks
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateManyProducts } from "../../hooks/useUpdateManyProducts";
import { useDeleteManySaleDetails } from "../../hooks/useDeleteManySaleDetails";
import { useMessage } from "../../hooks/useMessage";

// components
import Loading from "../common/Loading";

const SaleFormEdit = (props) => {
  const { onSubmit, onCancelOperation, saleToUpdate, saleDetails, isLoading } =
    props;

  const { showMessage } = useMessage();

  const queryClient = useQueryClient();

  const { updateManyProducts } = useUpdateManyProducts();
  const { deleteManySaleDetails } = useDeleteManySaleDetails();

  const products = queryClient.getQueryData(["products", { filters: {} }]);
  const clients = queryClient.getQueryData(["clients", { filters: {} }]);
  const methodPayments = queryClient.getQueryData([
    "methodPayments",
    { filters: {} },
  ]);

  const SaleSchema = Yup.object().shape({
    client: Yup.string().required("Requerido"),
    methodPayment: Yup.string().required("Requerido"),
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
      methodPayment: saleToUpdate?.methodPayment?._id || "",
      isPaid: saleToUpdate !== undefined ? saleToUpdate?.isPaid : false,
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
        showMessage(
          "No se puede guardar.",
          "error",
          "red",
          "Hay productos que superan el stock"
        );
      } else {
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

  const handleSelectMethodPayment = (options) => {
    formik.setFieldValue("methodPayment", options?.value ? options?.value : "");
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

    await updateManyProducts({ products });

    await deleteManySaleDetails({
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

  const methodPaymentsOptions = methodPayments?.map((methodPayment) => {
    return { label: methodPayment.name, value: methodPayment._id };
  });

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
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
                        isInvalid={
                          formik.errors.client && formik.touched.client
                        }
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
                          isInvalid={
                            formik.errors.client && formik.touched.client
                          }
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
                      <FormControl
                        isInvalid={
                          formik.errors.methodPayment &&
                          formik.touched.methodPayment
                        }
                      >
                        <FormLabel htmlFor="methodPayment">
                          Método de pago:
                        </FormLabel>
                        <Select
                          value={methodPaymentsOptions?.filter(
                            (methodPayment) =>
                              methodPayment.value ===
                              formik.values.methodPayment
                          )}
                          options={methodPaymentsOptions}
                          onChange={handleSelectMethodPayment}
                          onBlur={(isTouched) =>
                            formik.setFieldTouched("methodPayment", isTouched)
                          }
                          name="methodPayment"
                          id="methodPayment"
                          isClearable={true}
                          placeholder="Buscar método de pago"
                          noOptionsMessage={() => "No hay métodos de pago"}
                          isDisabled={formik.values.isLoading}
                          isInvalid={
                            formik.errors.methodPayment &&
                            formik.touched.methodPayment
                          }
                          required
                        />
                        {formik.errors.methodPayment &&
                          formik.touched.methodPayment && (
                            <FormErrorMessage>
                              {formik.errors.methodPayment}
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
                                      formik?.touched?.saleItems?.at(index)
                                        ?.product
                                    }
                                  >
                                    <Select
                                      options={productsOptions}
                                      onChange={(value) =>
                                        handleSelectProduct(value, index)
                                      }
                                      noOptionsMessage={() =>
                                        "No hay productos"
                                      }
                                      value={productsOptions?.filter(
                                        (product) =>
                                          product.value ===
                                          formik?.values?.saleItems[index]
                                            ?.product
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
                                        formik?.values?.saleItems[index]
                                          ?.quantity
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

                  <Stack
                    mt={6}
                    spacing={3}
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"end"}
                  >
                    <Button
                      isLoading={isLoading}
                      type="submit"
                      colorScheme="purple"
                      variant="solid"
                    >
                      Actualizar
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
      )}
    </>
  );
};

export default SaleFormEdit;
