import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
} from "@chakra-ui/react";

import NameSchema from "../schemas/name";

// formik
import { useFormik } from "formik";

// Components
import MyInput from "../ui/inputs/MyInput";
import Loading from "../common/Loading";

const CategoryAddEditForm = (props) => {
  const {
    onSubmit,
    onCancelOperation,
    categoryToUpdate,
    isEditing,
    isLoading,
  } = props;

  const formik = useFormik({
    initialValues: {
      name: (isEditing && categoryToUpdate?.name) || "",
      isLoading: false,
    },
    validationSchema: NameSchema,
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={3} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  {!isEditing ? "Nueva categoria" : "Modificar categoria"}
                </Heading>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        formik={formik}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre de la categoria"}
                        label={"Nombre"}
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

export default CategoryAddEditForm;
