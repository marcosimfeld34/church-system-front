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

import { useNavigate, useLocation } from "react-router-dom";

// components
import Client from "./Client";

// custom hooks
import { useClients } from "../hooks/useClients";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";

const Clients = () => {
  const queryClients = useClients();

  const { logout } = useLogout();
  const { showMessage } = useMessage();

  const location = useLocation();

  const navigate = useNavigate();

  if (queryClients?.isError && queryClients?.error?.response?.status === 403) {
    logout().then((res) => {
      if (res.loggedOut) {
        showMessage("Venció la sesión", "success", "purple");

        navigate("/login", { state: { from: location }, replace: true });
      }
    });
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
      {!queryClients?.isLoading && (
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

      {queryClients?.data?.length > 0 && !queryClients?.isLoading && (
        <Grid>{clientList}</Grid>
      )}
      {queryClients?.data?.length === 0 && !queryClients?.isLoading && (
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
