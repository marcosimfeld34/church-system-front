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
} from "@chakra-ui/react";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

const ClientFormAdd = (props) => {
  const { onSubmit, onCancelOperation } = props;

  const ClientSchema = Yup.object().shape({
    name: Yup.string().required("Requerido"),
  });

  const { handleSubmit, values, handleChange, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        isLoading: false,
      },
      validationSchema: ClientSchema,
      enableReinitialize: true,
      onSubmit: (values) => {
        setFieldValue("isLoading", true);
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
                Nuevo cliente:
              </Heading>
              <form noValidate onSubmit={handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.name}>
                      <FormLabel>Nombre:</FormLabel>
                      <Input
                        name="name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        isDisabled={values.isLoading}
                        placeholder="Nombre del cliente"
                        isInvalid={errors.name && touched.name}
                        required
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
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

export default ClientFormAdd;
