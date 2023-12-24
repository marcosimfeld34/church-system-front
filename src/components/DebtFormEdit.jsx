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
import Select from "react-select";

// formik
import { useFormik } from "formik";

const DebtFormEdit = (props) => {
  const { onSubmit, onCancelOperation, debtToUpdate, clients, sales } = props;

  const DebtSchema = Yup.object().shape({
    client: Yup.string().required("Requerido"),
    sale: Yup.string().required("Requerido"),
    initialAmount: Yup.number().required("Requerido"),
    deliveredAmount: Yup.number().required("Requerido"),
  });

  const formik = useFormik({
    initialValues: {
      client: debtToUpdate?.client?._id || "",
      isLoading: false,
      sale: debtToUpdate?.sale?._id || "",
      initialAmount: debtToUpdate?.initialAmount || "",
      deliveredAmount:
        debtToUpdate?.deliveredAmount > 0 ? debtToUpdate?.deliveredAmount : 0,
    },
    validationSchema: DebtSchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      formik.setFieldValue("isLoading", true);

      const error = await onSubmit(values);

      if (!error) {
        formik.setFieldValue("isLoading", false);
      }
    },
  });

  const handleSelectClients = ({ value }) => {
    formik.setFieldValue("client", value);
  };

  const clientsOptions = clients?.map((client) => {
    return { label: client.name, value: client._id };
  });

  const handleSelectSales = ({ value }) => {
    formik.setFieldValue("sale", value);
  };

  const salesOptions = sales?.map((sale) => {
    return { label: `${sale.client.name} - ${sale.total}`, value: sale._id };
  });

  return (
    <>
      <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
        <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
          <Card mb={3} variant="outline">
            <CardBody>
              <Heading mb={3} textAlign="center" size="lg">
                Modificar deuda:
              </Heading>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={formik.errors.client}>
                      <FormLabel>Cliente:</FormLabel>
                      <Select
                        options={clientsOptions}
                        onChange={handleSelectClients}
                        noOptionsMessage={() => "No hay clientes"}
                        value={clientsOptions?.filter(
                          (client) => client.value === formik.values.client
                        )}
                        name="client"
                        // isDisabled={true}
                        placeholder="Buscar cliente ..."
                        isInvalid={
                          formik.errors.client && formik.touched.client
                        }
                        required
                      />
                      <FormErrorMessage>
                        {formik.errors.client}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={formik.errors.sale}>
                      <FormLabel>Venta:</FormLabel>
                      <Select
                        options={salesOptions}
                        onChange={handleSelectSales}
                        noOptionsMessage={() => "No hay ventas"}
                        value={salesOptions?.filter(
                          (sale) => sale.value === formik.values.sale
                        )}
                        name="sale"
                        isDisabled={true}
                        placeholder="Buscar venta ..."
                        isInvalid={formik.errors.sale && formik.touched.sale}
                        required
                      />
                      <FormErrorMessage>{formik.errors.sale}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={formik.errors.initialAmount}>
                      <FormLabel>Monto de deuda</FormLabel>
                      <Input
                        name="initialAmount"
                        type="number"
                        value={formik.values.initialAmount}
                        onChange={formik.handleChange}
                        placeholder="Monto deuda"
                        isDisabled={true}
                        isInvalid={
                          formik.errors.initialAmount &&
                          formik.touched.initialAmount
                        }
                        required
                      />
                      <FormErrorMessage>
                        {formik.errors.initialAmount}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={formik.errors.deliveredAmount}>
                      <FormLabel>Monto saldado</FormLabel>
                      <Input
                        name="deliveredAmount"
                        type="number"
                        value={formik.values.deliveredAmount}
                        isDisabled={formik.values.isLoading}
                        onChange={formik.handleChange}
                        placeholder="Monto saldado"
                        isInvalid={
                          formik.errors.deliveredAmount &&
                          formik.touched.deliveredAmount
                        }
                        required
                      />
                      <FormErrorMessage>
                        {formik.errors.deliveredAmount}
                      </FormErrorMessage>
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

export default DebtFormEdit;
