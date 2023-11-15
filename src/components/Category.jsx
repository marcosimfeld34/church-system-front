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

import { useCategoryContext } from "../hooks/useCategoryContext";
import { useAuthContext } from "../hooks/useAuthContext";

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";

const Category = ({ category }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { handleDeleteCategory } = useCategoryContext();

  const handleEdit = () => {
    navigate(`${category._id}/edit`);
  };

  const handleDelete = () => {
    handleDeleteCategory(category);
    navigate("/categories");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GridItem colSpan="5" mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xl" align="start">
                  {category.name}
                </Text>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrar categoria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar el categoria{" "}
              <Text as={"b"}>{category.name}</Text>?
            </p>
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

export default Category;
