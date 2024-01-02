import {
  Grid,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Stack,
  Skeleton,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";

// components
import Client from "./Client";

// custom hooks
import { useClients } from "../../hooks/useClients";
import { useError } from "../../hooks/useError";

const Clients = () => {
  const queryClients = useClients();

  const { throwError } = useError();

  const navigate = useNavigate();

  if (queryClients?.isError) {
    throwError(queryClients?.error);
  }

  const handleAddClient = () => {
    navigate("/clients/add");
  };

  const clientList = queryClients?.data?.map((client) => {
    return <Client key={client?._id + client?.createdAt} client={client} />;
  });

  return (
    <>
      {queryClients?.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
      )}
      {!queryClients?.isError && !queryClients?.isLoading && (
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {clientList?.length} clientes
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddClient()}
                colorScheme="purple"
                variant="solid"
              >
                <AddIcon boxSize={3} me={2} />
                Agregar cliente
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

      {queryClients?.isLoading && (
        <>
          <Card variant="filled" mb={3}>
            <CardBody>
              <Flex>
                <Spacer />
                <Skeleton
                  width={"170px"}
                  startColor="purple.500"
                  endColor="purple.300"
                  height="40px"
                  borderRadius={"5px"}
                />
              </Flex>
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

      {!queryClients?.isError &&
        queryClients?.data?.length > 0 &&
        !queryClients?.isLoading && <Grid>{clientList}</Grid>}
      {!queryClients?.isError &&
        queryClients?.data?.length === 0 &&
        !queryClients?.isLoading && (
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Alert colorScheme="purple" status="success">
                <AlertIcon />
                No hay clientes cargados.
              </Alert>
            </CardBody>
          </Card>
        )}
    </>
  );
};

export default Clients;
