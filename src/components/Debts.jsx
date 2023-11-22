import { useQuery } from "react-query";

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

import { Navigate } from "react-router-dom";

// components
import Debt from "./Debt";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useDebtContext } from "../hooks/useDebtContext";
import { useClientContext } from "../hooks/useClientContext";
import { useState } from "react";

const Debts = () => {
  const { getDebts } = useDebtContext();
  const { getClients } = useClientContext();
  const [currentClient, setCurrentClient] = useState("");

  const { user } = useAuthContext();

  const { data: debts, isLoading } = useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
  });

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const debtList = debts
    ?.filter((debt) => debt.isPaid === false)
    ?.map((debt) => {
      return <Debt key={debt?._id} debt={debt} />;
    });

  const totalAmountByClient = debts
    ?.map((debt) => {
      if (debt.client._id === currentClient) {
        return debt?.initialAmount - debt?.deliveredAmount;
      }
      return 0;
    })
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const totalAmountDebts = debts
    ?.map((debt) => debt?.initialAmount - debt?.deliveredAmount)
    ?.reduce((acc, currentValue) => acc + currentValue, 0)
    .toFixed(2);

  const handleSelectClients = (option) => {
    setCurrentClient(option?.value ? option?.value : "");
  };

  const clientsOptions = clients?.map((client) => {
    return { label: client.name, value: client._id };
  });

  return (
    <>
      {user.profile !== "System Administrator" && (
        <Navigate to="/" replace={true} />
      )}
      {isLoading && (
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
      {!isLoading && (
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
                        currency: "ARS",
                      }).format(totalAmountByClient)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "ARS",
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

      {isLoading && (
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

      {debtList?.length > 0 && !isLoading && <Grid>{debtList}</Grid>}
      {debtList?.length === 0 && !isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            {/* <Text>No hay deudas 😂. </Text> */}
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
