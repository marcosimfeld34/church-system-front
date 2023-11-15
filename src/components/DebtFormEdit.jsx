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

  const { handleSubmit, values, handleChange, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        client: debtToUpdate?.client?._id || "",
        sale: debtToUpdate?.sale?._id || "",
        initialAmount: debtToUpdate?.initialAmount || "",
        deliveredAmount:
          debtToUpdate?.deliveredAmount > 0 ? debtToUpdate?.deliveredAmount : 0,
      },
      validationSchema: DebtSchema,
      enableReinitialize: true,
      onSubmit,
    });

  const handleSelectClients = ({ value }) => {
    setFieldValue("client", value);
  };

  const clientsOptions = clients?.map((client) => {
    return { label: client.name, value: client._id };
  });

  const handleSelectSales = ({ value }) => {
    setFieldValue("sale", value);
  };

  const salesOptions = sales?.map((sale) => {
    return { label: `${sale.client.name} - ${sale.total}`, value: sale._id };
  });

  return (
    <>
      <Grid templateColumns="repeat(6, 1fr)" mt={5}>
        <GridItem colSpan={4} colStart={2}>
          <Card mb={3} variant="outline">
            <CardBody>
              <Heading mb={3} textAlign="center" size="lg">
                Modificar deuda:
              </Heading>
              <form noValidate onSubmit={handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.client}>
                      <FormLabel>Cliente:</FormLabel>
                      <Select
                        options={clientsOptions}
                        onChange={handleSelectClients}
                        noOptionsMessage={() => "No hay clientes"}
                        value={clientsOptions?.filter(
                          (client) => client.value === values.client
                        )}
                        name="client"
                        isDisabled={true}
                        placeholder="Buscar cliente ..."
                        isInvalid={errors.client && touched.client}
                        required
                      />
                      <FormErrorMessage>{errors.client}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.sale}>
                      <FormLabel>Venta:</FormLabel>
                      <Select
                        options={salesOptions}
                        onChange={handleSelectSales}
                        noOptionsMessage={() => "No hay ventas"}
                        value={salesOptions?.filter(
                          (sale) => sale.value === values.sale
                        )}
                        name="sale"
                        isDisabled={true}
                        placeholder="Buscar venta ..."
                        isInvalid={errors.sale && touched.sale}
                        required
                      />
                      <FormErrorMessage>{errors.sale}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.initialAmount}>
                      <FormLabel>Monto de deuda</FormLabel>
                      <Input
                        name="initialAmount"
                        type="number"
                        value={values.initialAmount}
                        onChange={handleChange}
                        placeholder="Monto deuda"
                        isDisabled={true}
                        isInvalid={
                          errors.initialAmount && touched.initialAmount
                        }
                        required
                      />
                      <FormErrorMessage>
                        {errors.initialAmount}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl isInvalid={errors.deliveredAmount}>
                      <FormLabel>Monto saldado</FormLabel>
                      <Input
                        name="deliveredAmount"
                        type="number"
                        value={values.deliveredAmount}
                        onChange={handleChange}
                        placeholder="Monto saldado"
                        isInvalid={
                          errors.deliveredAmount && touched.deliveredAmount
                        }
                        required
                      />
                      <FormErrorMessage>
                        {errors.deliveredAmount}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>

                <VStack
                  divider={<StackDivider borderColor="gray.200" />}
                  spacing={3}
                  align="stretch"
                >
                  <Button type="submit" colorScheme="purple" variant="solid">
                    Actualizar
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

export default DebtFormEdit;
