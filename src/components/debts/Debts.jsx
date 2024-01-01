import {
  Grid,
  Card,
  CardBody,
  Flex,
  Text,
  Stack,
  Skeleton,
  FormControl,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Select from "react-select";
import { useState } from "react";

// components
import Debt from "./Debt";

// custom hooks
import { useDebts } from "../../hooks/useDebts";
import { useClients } from "../../hooks/useClients";

const Debts = () => {
  const [currentClient, setCurrentClient] = useState("");

  const queryDebts = useDebts();
  const queryClients = useClients();

  const debtList = queryDebts?.data
    ?.filter((debt) => !debt.isPaid)
    .map((debt) => {
      return <Debt key={debt?._id + debt?.createdAt} debt={debt} />;
    });

  const totalAmountByClient = queryDebts?.data
    ?.map((debt) => {
      if (debt.client._id === currentClient) {
        return debt?.initialAmount - debt?.deliveredAmount;
      }
      return 0;
    })
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const totalAmountDebts = queryDebts?.data
    ?.map((debt) => debt?.initialAmount - debt?.deliveredAmount)
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const handleSelectClients = (option) => {
    setCurrentClient(option?.value ? option?.value : "");
  };

  const clientsOptions = queryClients?.data?.map((client) => {
    return { label: client.name, value: client._id };
  });

  return (
    <>
      {queryDebts?.isLoading && (
        <Card variant="outline" mt={5}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}
      {!queryDebts.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Flex direction={"column"}>
              <Text>Total</Text>
              {currentClient === "" && (
                <Text fontSize={"2xl"} as="b">
                  {totalAmountDebts && currentClient === ""
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(totalAmountDebts)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              )}
              {currentClient !== "" && (
                <Text fontSize={"2xl"} as="b">
                  {totalAmountByClient && currentClient !== ""
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(totalAmountByClient)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
              )}
            </Flex>
          </CardBody>
        </Card>
      )}
      <Card variant="outline" mt={5} mb={3}>
        <CardBody>
          <Flex>
            <FormControl>
              {/* <FormLabel>Filtrar por cliente:</FormLabel> */}
              <Select
                options={clientsOptions}
                onChange={handleSelectClients}
                noOptionsMessage={() => "No hay clientes"}
                isClearable={true}
                name="client"
                placeholder="Filtrar por cliente ..."
              />
            </FormControl>
          </Flex>
        </CardBody>
      </Card>

      {queryDebts?.isLoading && (
        <>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
          <Card variant="outline" mb={3}>
            <CardBody>
              <Stack>
                <Skeleton height="10px" />
                <Skeleton height="10px" />
                <Skeleton height="10px" />
              </Stack>
            </CardBody>
          </Card>
        </>
      )}

      {debtList?.length > 0 && !queryDebts?.isLoading && (
        <Grid>{debtList}</Grid>
      )}
      {debtList?.length === 0 && !queryDebts?.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Alert colorScheme="purple" status="success">
              <AlertIcon />
              Tus clientes están al día.
            </Alert>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default Debts;
