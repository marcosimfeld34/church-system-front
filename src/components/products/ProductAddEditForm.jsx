import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

// components
import MyInput from "../ui/inputs/MyInput";
import MySelect from "../ui/inputs/MySelect";
import Loading from "../common/Loading";

const ProductAddEditForm = (props) => {
  const {
    onSubmit,
    onCancelOperation,
    productToUpdate,
    categories,
    isEditing,
    isLoading,
  } = props;

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
      name: (isEditing && productToUpdate?.name) || "",
      costPrice: (isEditing && productToUpdate?.costPrice) || "",
      salePrice: (isEditing && productToUpdate?.salePrice) || "",
      category: (isEditing && productToUpdate?.category?._id) || "",
      stock: (isEditing && productToUpdate?.stock) || "",
    },
    enableReinitialize: true,
    validationSchema: ProductSchema,
    onSubmit,
  });

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns="repeat(12, 1fr)" mt={5} mb={10}>
          <GridItem
            colSpan={{ base: 10, sm: 8, md: 8 }}
            colStart={{ base: 2, sm: 3, md: 3 }}
          >
            <Card mb={10} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  {!isEditing ? "Nuevo producto:" : "Modificar producto:"}
                </Heading>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formik={formik}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre producto"}
                        label={"Nombre"}
                        isRequired={true}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formik={formik}
                        field={"costPrice"}
                        type={"number"}
                        placeholder={"Precio de costo"}
                        label={"Precio de costo"}
                        isRequired={true}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formik={formik}
                        field={"salePrice"}
                        type={"number"}
                        placeholder={"Precio de venta"}
                        label={"Precio de venta"}
                        isRequired={true}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <Text fontWeight={"semibold"}>
                        Porcentaje de ganancia:
                      </Text>
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
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formik={formik}
                        field={"category"}
                        placeholder={"Buscar categoria ..."}
                        label={"Categoria"}
                        data={categories}
                        isRequired={true}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formik={formik}
                        field={"stock"}
                        type={"number"}
                        placeholder={"Stock"}
                        label={"Stock"}
                        isRequired={true}
                      />
                    </GridItem>
                  </Grid>

                  <Stack
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
                      {!isEditing ? "Guardar" : "Actualizar"}
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

export default ProductAddEditForm;
