import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
} from "@chakra-ui/react";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

// components
import MyInput from "../ui/inputs/MyInput";
import MySelect from "../ui/inputs/MySelect";
import Loading from "../common/Loading";

const DebtAddEditForm = (props) => {
  const {
    onSubmit,
    onCancelOperation,
    debtToUpdate,
    clients,
    sales,
    isEditing,
    isLoading,
  } = props;

  const DebtSchema = Yup.object().shape({
    client: Yup.string().required("Requerido"),
    sale: Yup.string().required("Requerido"),
    initialAmount: Yup.number().required("Requerido"),
    deliveredAmount: Yup.number().required("Requerido"),
  });

  const formik = useFormik({
    initialValues: {
      client: (isEditing && debtToUpdate?.client?._id) || "",
      sale: (isEditing && debtToUpdate?.sale?._id) || "",
      initialAmount: (isEditing && debtToUpdate?.initialAmount) || "",
      deliveredAmount:
        isEditing && debtToUpdate?.deliveredAmount > 0
          ? debtToUpdate?.deliveredAmount
          : 0,
    },
    validationSchema: DebtSchema,
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
                  {!isEditing ? "" : "Modificar deuda:"}
                </Heading>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Grid mb={4}>
                    <GridItem>
                      <MySelect
                        formik={formik}
                        field={"client"}
                        placeholder={"Buscar cliente ..."}
                        label={"Cliente"}
                        data={clients}
                        isRequired={true}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MySelect
                        formik={formik}
                        field={"sale"}
                        placeholder={"Buscar venta ..."}
                        isDisabled={true}
                        label={"Venta"}
                        data={sales}
                        isRequired={true}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        formik={formik}
                        field={"initialAmount"}
                        type={"number"}
                        placeholder={"Monto deuda"}
                        label={"Monto de deuda"}
                        isDisabled={true}
                        isRequired={true}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        formik={formik}
                        field={"deliveredAmount"}
                        type={"number"}
                        placeholder={"Monto saldado"}
                        label={"Monto saldado"}
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

export default DebtAddEditForm;
