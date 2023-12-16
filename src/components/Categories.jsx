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
  Text,
  AlertIcon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useNavigate, useLocation } from "react-router-dom";

// components
import Category from "./Category";

// custom hooks
import { useCategories } from "../hooks/useCategories";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";

const Categories = () => {
  const queryCategories = useCategories();

  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const location = useLocation();

  const { logout } = useLogout();

  if (
    queryCategories?.isError &&
    queryCategories?.error?.response?.status === 403
  ) {
    logout().then((res) => {
      if (res.loggedOut) {
        showMessage("Venció la sesión", "success", "purple");
        navigate("/login", { state: { from: location }, replace: true });
      }
    });
  }

  const handleAddCategory = () => {
    navigate("/categories/add");
  };

  const categoryList = queryCategories?.data?.map((category) => {
    return (
      <Category key={category?._id + category?.createdAt} category={category} />
    );
  });

  if (queryCategories?.isLoading) {
    return (
      <>
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </CardBody>
        </Card>
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
    );
  }

  return (
    <>
      {!queryCategories?.isLoading && (
        <Card bgColor={"#373E68"} variant="filled" mt={5} mb={3}>
          <CardBody>
            <Flex placeItems={"center"}>
              <Text color={"white"} fontWeight={"bold"}>
                {categoryList?.length} categorias
              </Text>
              <Spacer />
              <Button
                onClick={() => handleAddCategory()}
                colorScheme="purple"
                variant="solid"
              >
                <AddIcon boxSize={3} me={2} />
                Agregar categoria
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

      {queryCategories?.data?.length > 0 && !queryCategories?.isLoading && (
        <Grid>{categoryList}</Grid>
      )}
      {queryCategories?.data?.length === 0 && !queryCategories?.isLoading && (
        <Card variant="outline" mt={5} mb={3}>
          <CardBody>
            <Alert colorScheme="purple" status="success">
              <AlertIcon />
              No hay categorias cargadas.
            </Alert>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default Categories;
