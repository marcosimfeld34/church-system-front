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

import { useProductContext } from "../hooks/useProductContext";
import { useAuthContext } from "../hooks/useAuthContext";

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Product = ({ product }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { handleDeleteProduct } = useProductContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    navigate(`${product._id}/edit`);
  };

  const handleDetails = () => {
    navigate(`/products/${product._id}/details`);
  };

  const handleDelete = () => {
    setIsLoading(true);
    handleDeleteProduct(product);
    navigate("/products");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GridItem colSpan="5" mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xl" align="start" mr={4}>
                  {product.name}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme="purple"
                  alignSelf={"start"}
                >
                  {product.category.name}
                </Badge>
                <Text fontSize="xs" align="start">
                  Stock:{" "}
                  <Text fontWeight={"bold"} as={"span"}>
                    {product.stock}
                  </Text>
                </Text>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                <Text as="b" alignSelf="end">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    minimumFractionDigits: 2,
                    currency: "USD",
                  }).format(product.salePrice.toFixed(2))}
                </Text>
                {user.profile === "System Administrator" && (
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
                )}
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <Modal size={{ base: "xs", md: "lg" }} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrar producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar el producto{" "}
              <Text as={"b"}>{product.name}</Text>?
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

export default Product;
