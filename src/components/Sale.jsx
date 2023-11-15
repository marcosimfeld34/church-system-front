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
  Badge,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { useSaleContext } from "../hooks/useSaleContext";

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";

import { format } from "date-fns";
import { es } from "date-fns/locale";

const Sale = ({ sale, saleDetails, debt }) => {
  const navigate = useNavigate();

  const { handleDeleteSale } = useSaleContext();

  const handleEdit = () => {
    navigate(`${sale._id}/edit`);
  };

  const handleDetails = () => {
    navigate(`/${sale._id}/details`);
  };

  const handleDelete = () => {
    handleDeleteSale(sale, saleDetails, debt);
    navigate("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GridItem colSpan="5" mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Flex
                  // bg={"blue"}
                  alignItems={"center"}
                  // justifyContent={"space-around"}
                >
                  <Text fontSize="lg" align="start" mr={2}>
                    {sale?.client?.name}
                  </Text>
                  <Badge
                    variant={"subtle"}
                    colorScheme={sale?.isPaid ? "green" : "red"}
                  >
                    {sale?.isPaid ? "Pagado" : "Debe"}
                  </Badge>
                </Flex>
                <Text fontSize="xs" align="start">
                  Vendedor: {sale?.createdBy?.firstName}{" "}
                  {sale?.createdBy?.lastName}
                </Text>
                <Text color={"gray.500"} fontSize="xs" align="start">
                  {format(new Date(sale?.createdAt), "eeee dd yyyy", {
                    locale: es,
                  })}
                </Text>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                <Text as="b" alignSelf="end">
                  {sale?.total
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        minimumFractionDigits: 2,
                        currency: "USD",
                      }).format(sale?.total)
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
                            onClick={() => handleDetails()}
                            variant="blue"
                            colorScheme="blue"
                            justifyContent={"start"}
                            size="md"
                            _hover={{
                              textDecoration: "none",
                              color: "purple",
                              bg: "purple.100",
                            }}
                          >
                            Ver detalles
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrar venta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              ¿Estás seguro de eliminar el venta{" "}
              <Text fontWeight={"bold"} as={"span"}>
                {sale.client.name} - {sale.total}?
              </Text>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDelete()}>
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

export default Sale;
