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
} from "@chakra-ui/react";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

const MethodPaymentFormAdd = (props) => {
  const { onSubmit, onCancelOperation } = props;

  const MethodPaymentSchema = Yup.object().shape({
    name: Yup.string().required("Requerido"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      isLoading: false,
    },
    validationSchema: MethodPaymentSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      formik.setFieldValue("isLoading", true);
      onSubmit(values);
    },
  });

  return (
    <>
      <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
        <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
          <Card mb={3} variant="outline">
            <CardBody>
              <Heading mb={3} textAlign="center" size="lg">
                Nuevo método de pago:
              </Heading>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={formik.errors.name && formik.touched.name}
                    >
                      <FormLabel>Nombre:</FormLabel>
                      <Input
                        name="name"
                        id="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={formik.values.isLoading}
                        placeholder="Nombre del método de pago"
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

export default MethodPaymentFormAdd;