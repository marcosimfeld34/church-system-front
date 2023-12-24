import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

import { useSaleDetails } from "../hooks/useSaleDetails";
import { usePayDebt } from "../hooks/usePayDebt";
import { useDeleteSale } from "../hooks/useDeleteSale";
import { useMessage } from "../hooks/useMessage";

const Debt = ({ debt }) => {
  const navigate = useNavigate();

  const { payDebt } = usePayDebt();

  const { deleteSale } = useDeleteSale();
  const { showMessage } = useMessage();

  const [isLoading, setIsLoading] = useState(false);

  const querySaleDetails = useSaleDetails({ all: false });

  const saleDetailsToDelete = querySaleDetails?.data?.filter(
    (saleDetail) => saleDetail.sale === debt?.sale?._id
  );

  const handlePaidTotal = async () => {
    const response = await payDebt({ debtToUpdate: debt });
    if (response?.isUpdated) {
      showMessage("Deuda pagada.", "success", "purple");
      setIsLoading(false);
    }

    if (!response?.isUpdated) {
      showMessage("No se pudo actualizar", "error", "red");
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`${debt?._id}/edit`);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteSale({
      saleId: debt?.sale?._id,
      saleDetails: saleDetailsToDelete,
      debt: debt,
    });
    navigate("/debts");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GridItem colSpan="5" mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="md" align="start">
                  Cliente:{" "}
                  <Text as={"span"} fontWeight={"500"}>
                    {debt?.client?.name}
                  </Text>
                </Text>
                <Text fontSize="sm" align="start">
                  Entregado:{" "}
                  <Text color={"#3FC56B"} as={"span"} fontWeight={"bold"}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "USD",
                    }).format(debt?.deliveredAmount.toFixed(2))}
                  </Text>
                </Text>
                <Text fontSize="sm" align="start">
                  Saldo:{" "}
                  <Text color={"red"} as={"span"} fontWeight={"bold"}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "USD",
                    }).format(
                      (debt?.initialAmount - debt?.deliveredAmount).toFixed(2)
                    )}
                  </Text>
                </Text>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xs" alignSelf={"end"}>
                  Deuda inicial
                </Text>
                <Text as="b" alignSelf="end">
                  {debt?.initialAmount
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(debt?.initialAmount)
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(0)}
                </Text>
                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <IconButton
                      alignSelf="end"
                      variant={"link"}
                      colorScheme="blackAlpha"
                      size="md"
                      icon={
                        <>
                          <AddIcon boxSize="3" />
                          <ChevronDownIcon boxSize="4" />
                        </>
                      }
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width="3xs">
                      <PopoverArrow />
                      <PopoverBody p={0}>
                        <VStack spacing={1} align="stretch">
                          <Button
                            onClick={() => handlePaidTotal()}
                            variant={"blue"}
                            colorScheme="blue"
                            justifyContent={"start"}
                            size="md"
                            _hover={{
                              textDecoration: "none",
                              color: "purple",
                              bg: "purple.100",
                            }}
                          >
                            Pago total
                          </Button>
                          <Button
                            onClick={() => handleEdit()}
                            variant={"blue"}
                            colorScheme="blue"
                            justifyContent={"start"}
                            size="md"
                            _hover={{
                              textDecoration: "none",
                              color: "purple",
                              bg: "purple.100",
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            onClick={onOpen}
                            variant={"blue"}
                            colorScheme="blue"
                            justifyContent={"start"}
                            size="md"
                            _hover={{
                              textDecoration: "none",
                              color: "purple",
                              bg: "purple.100",
                            }}
                          >
                            Borrar
                          </Button>
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <Modal size={{ base: "xs", md: "lg" }} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrar deuda</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar la deuda{" "}
              <Text as={"b"}>{debt?.client?.name}</Text>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="red"
              mr={3}
              onClick={() => handleDelete()}
            >
              Borrar
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GridItem>
  );
};

export default Debt;
