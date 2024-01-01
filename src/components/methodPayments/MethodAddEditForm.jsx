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

const MethodPaymentAddEditForm = (props) => {
  const {
    onSubmit,
    onCancelOperation,
    methodPaymentToUpdate,
    isEditing,
    isLoading,
  } = props;

  const formik = useFormik({
    initialValues: {
      name: (isEditing && methodPaymentToUpdate?.name) || "",
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
                  {!isEditing
                    ? "Nuevo método de pago:"
                    : "Modificar método de pago:"}
                </Heading>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        formik={formik}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre del método de pago"}
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

export default MethodPaymentAddEditForm;
