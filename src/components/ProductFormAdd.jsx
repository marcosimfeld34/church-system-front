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
  VStack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";
import Select from "react-select";

// formik
import { useFormik } from "formik";

const ProductFormAdd = (props) => {
  const { onSubmit, onCancelOperation, categories } = props;

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

  const { handleSubmit, values, handleChange, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        costPrice: "",
        salePrice: "",
        category: "",
        stock: "",
        isLoading: false,
      },
      validationSchema: ProductSchema,
      enableReinitialize: true,
      onSubmit: (values) => {
        setFieldValue("isLoading", true);
        onSubmit(values);
      },
    });

  const handleSelectCategories = ({ value }) => {
    setFieldValue("category", value);
  };

  const categoriesOptions = categories?.map((category) => {
    return { label: category.name, value: category._id };
  });

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" mt={5}>
        <GridItem
          colSpan={{ base: 10, sm: 8, md: 8 }}
          colStart={{ base: 2, sm: 3, md: 3 }}
        >
          <Card mb={3} variant="outline">
            <CardBody>
              <Heading mb={3} textAlign="center" size="lg">
                Nuevo producto:
              </Heading>
              <form noValidate onSubmit={handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.name}>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        name="name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Nombre producto"
                        isInvalid={errors.name && touched.name}
                        required
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.costPrice}>
                      <FormLabel>Precio de costo:</FormLabel>
                      <Input
                        name="costPrice"
                        type="number"
                        min={0}
                        value={values.costPrice}
                        onChange={handleChange}
                        placeholder="Precio de costo"
                        isInvalid={errors.costPrice && touched.costPrice}
                        required
                      />
                      <FormErrorMessage>{errors.costPrice}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.salePrice}>
                      <FormLabel>Precio de venta:</FormLabel>
                      <Input
                        name="salePrice"
                        type="number"
                        min={0}
                        value={values.salePrice}
                        onChange={handleChange}
                        placeholder="Precio de venta"
                        isInvalid={errors.salePrice && touched.salePrice}
                        required
                      />
                      <FormErrorMessage>{errors.salePrice}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Porcentaje de ganancia:</FormLabel>
                      <Text>
                        Porcentaje de ganancia (%):{" "}
                        {values.costPrice && values.salePrice
                          ? (
                              (values.salePrice / values.costPrice - 1) *
                              100
                            ).toFixed(2)
                          : 0}
                      </Text>
                      {values.salePrice < values.costPrice ? (
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
                    <FormControl isInvalid={errors.category}>
                      <FormLabel>Categoria:</FormLabel>
                      <Select
                        options={categoriesOptions}
                        onChange={handleSelectCategories}
                        name="category"
                        placeholder="Buscar categoria ..."
                        noOptionsMessage={() => "No hay categorias"}
                        isInvalid={errors.category && touched.category}
                        required
                      />
                      <FormErrorMessage>{errors.category}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.stock}>
                      <FormLabel>Stock:</FormLabel>
                      <Input
                        name="stock"
                        type="number"
                        min={0}
                        value={values.stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        isInvalid={errors.stock && touched.stock}
                        required
                      />
                      <FormErrorMessage>{errors.stock}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>

                <VStack
                  divider={<StackDivider borderColor="gray.200" />}
                  spacing={3}
                  align="stretch"
                >
                  <Button
                    isLoading={values.isLoading}
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
                </VStack>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};

export default ProductFormAdd;
