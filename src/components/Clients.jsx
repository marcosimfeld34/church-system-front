import { useQuery } from "react-query";

import {
  Grid,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Stack,
  Skeleton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useNavigate, Navigate } from "react-router-dom";

// components
import Client from "./Client";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useClientContext } from "../hooks/useClientContext";

const Clients = () => {
  const { getClients } = useClientContext();

  const { user } = useAuthContext();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const navigate = useNavigate();

  const handleAddClient = () => {
    navigate("/clients/add");
  };

  const clientList = clients?.map((client) => {
    return <Client key={client._id} client={client} />;
  });

  return (
    <>
      {user.profile !== "System Administrator" && (
        <Navigate to="/" replace={true} />
      )}
      <Card variant="filled" mt={5} mb={3}>
        <CardBody>
          <Flex>
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

      {clients?.length > 0 && !isLoading && <Grid>{clientList}</Grid>}
      {clients?.length === 0 && !isLoading && (
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
