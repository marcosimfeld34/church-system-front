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
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";
import Select from "react-select";

// formik
import { useFormik } from "formik";

const ProductFormEdit = (props) => {
  const { onSubmit, onCancelOperation, productToUpdate, categories } = props;

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required("Requerido"),
    costPrice: Yup.number()
      .min(0.01, "Debe ser mayor o igual a 1")
      .required("Requerido"),
    salePrice: Yup.number()
      .min(0.01, "Debe ser mayor o igual a 1")
      .required("Requerido"),
    category: Yup.string().required("Requerido"),
    stock: Yup.number().required("Requerido"),
  });

  const formik = useFormik({
    initialValues: {
      name: productToUpdate?.name || "",
      costPrice: productToUpdate?.costPrice || "",
      salePrice: productToUpdate?.salePrice || "",
      category: productToUpdate?.category?._id || "",
      stock: productToUpdate?.stock || "",
      isLoading: false,
    },
    enableReinitialize: true,
    validationSchema: ProductSchema,
    onSubmit: (values) => {
      formik.setFieldValue("isLoading", true);
      onSubmit(values);
    },
  });

  const handleSelectCategories = (options) => {
    formik.setFieldValue("category", options?.value ? options?.value : "");
  };

  const categoriesOptions = categories?.map((category) => {
    return { label: category.name, value: category._id };
  });

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" mt={5} mb={10}>
        <GridItem
          colSpan={{ base: 10, sm: 8, md: 8 }}
          colStart={{ base: 2, sm: 3, md: 3 }}
        >
          <Card mb={10} variant="outline">
            <CardBody>
              <Heading mb={3} textAlign="center" size="lg">
                Modificar producto:
              </Heading>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={formik.errors.name && formik.touched.name}
                    >
                      <FormLabel htmlFor="name">Nombre</FormLabel>
                      <Input
                        name="name"
                        id="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={formik.values.isLoading}
                        placeholder="Nombre producto"
                        isInvalid={formik.errors.name && formik.touched.name}
                        required
                      />
                      {formik.errors.name && formik.touched.name && (
                        <FormErrorMessage>
                          {formik.errors.name}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={
                        formik.errors.costPrice && formik.touched.costPrice
                      }
                    >
                      <FormLabel htmlFor="costPrice">
                        Precio de costo:
                      </FormLabel>
                      <Input
                        name="costPrice"
                        id="costPrice"
                        type="number"
                        value={formik.values.costPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={formik.values.isLoading}
                        placeholder="Precio de costo"
                        isInvalid={
                          formik.errors.costPrice && formik.touched.costPrice
                        }
                        required
                      />
                      {formik.errors.costPrice && formik.touched.costPrice && (
                        <FormErrorMessage>
                          {formik.errors.costPrice}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={
                        formik.errors.salePrice && formik.touched.salePrice
                      }
                    >
                      <FormLabel htmlFor="salePrice">
                        Precio de venta:
                      </FormLabel>
                      <Input
                        name="salePrice"
                        id="salePrice"
                        type="number"
                        min={0}
                        value={formik.values.salePrice}
                        isDisabled={formik.values.isLoading}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Precio de venta"
                        isInvalid={
                          formik.errors.salePrice && formik.touched.salePrice
                        }
                        required
                      />
                      {formik.errors.salePrice && formik.touched.salePrice && (
                        <FormErrorMessage>
                          {formik.errors.salePrice}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Porcentaje de ganancia:</FormLabel>
                      <Text>
                        Porcentaje de ganancia (%):{" "}
                        {formik.values.costPrice && formik.values.salePrice
                          ? (
                              (formik.values.salePrice /
                                formik.values.costPrice -
                                1) *
                              100
                            ).toFixed(2)
                          : 0}
                      </Text>
                      {formik.values.salePrice < formik.values.costPrice ? (
                        <Text fontSize={"sm"} color={"red.500"}>
                          El precio de venta debe ser mayor al costo de venta
                        </Text>
                      ) : (
                        ""
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={
                        formik.errors.category && formik.touched.category
                      }
                    >
                      <FormLabel htmlFor="category">Categoria:</FormLabel>
                      <Select
                        options={categoriesOptions}
                        onChange={handleSelectCategories}
                        onBlur={(isTouched) =>
                          formik.setFieldTouched("category", isTouched)
                        }
                        isDisabled={formik.values.isLoading}
                        isClearable={true}
                        value={categoriesOptions?.filter(
                          (category) =>
                            category.value === formik.values.category
                        )}
                        name="category"
                        id="category"
                        placeholder="Buscar categoria ..."
                        noOptionsMessage={() => "No hay categorias"}
                        isInvalid={
                          formik.errors.category && formik.touched.category
                        }
                        required
                      />
                      {formik.errors.category && formik.touched.category && (
                        <FormErrorMessage>
                          {formik.errors.category}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={formik.errors.stock && formik.touched.stock}
                    >
                      <FormLabel htmlFor="stock">Stock:</FormLabel>
                      <Input
                        name="stock"
                        id="stock"
                        type="number"
                        value={formik.values.stock}
                        isDisabled={formik.values.isLoading}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Stock"
                        isInvalid={formik.errors.stock && formik.touched.stock}
                        required
                      />
                      {formik.errors.stock && formik.touched.stock && (
                        <FormErrorMessage>
                          {formik.errors.stock}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>

                <Stack
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
    </>
  );
};

export default ProductFormEdit;
