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
import MethodPayment from "./MethodPayment";

// custom hooks
import { useMethodPayments } from "../../hooks/useMethodPayments";
import { useError } from "../../hooks/useError";

const MethodPayments = () => {
  const queryMethodPayments = useMethodPayments();

  const { throwError } = useError();

  const navigate = useNavigate();

  if (queryMethodPayments?.isError) {
    throwError(queryMethodPayments?.error);
  }

  const handleAddClient = () => {
    navigate("/methodPayments/add");
  };

  const methodPaymentsList = queryMethodPayments?.data?.map((methodPayment) => {
    return (
      <MethodPayment
        key={methodPayment?._id + methodPayment?.createdAt}
        methodPayment={methodPayment}
      />
    );
  });

  return (
    <>
      {queryMethodPayments?.isLoading && (
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
      {!queryMethodPayments?.isError && !queryMethodPayments?.isLoading && (
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {methodPaymentsList?.length} métodos de pago
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddClient()}
                colorScheme="purple"
                variant="solid"
              >
                <AddIcon boxSize={3} me={2} />
                Agregar método de pago
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

      {queryMethodPayments?.isLoading && (
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

      {!queryMethodPayments?.isError &&
        queryMethodPayments?.data?.length > 0 &&
        !queryMethodPayments?.isLoading && <Grid>{methodPaymentsList}</Grid>}
      {!queryMethodPayments?.isError &&
        queryMethodPayments?.data?.length === 0 &&
        !queryMethodPayments?.isLoading && (
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Alert colorScheme="purple" status="success">
                <AlertIcon />
                No hay métodos de pago cargados.
              </Alert>
            </CardBody>
          </Card>
        )}
    </>
  );
};

export default MethodPayments;
