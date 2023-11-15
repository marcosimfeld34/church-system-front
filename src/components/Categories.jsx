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
import Category from "./Category";

// custom hooks
import { useCategoryContext } from "../hooks/useCategoryContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Categories = () => {
  const { getCategories } = useCategoryContext();

  const { user } = useAuthContext();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const navigate = useNavigate();

  const handleAddCategory = () => {
    navigate("/categories/add");
  };

  const categoryList = categories?.map((category) => {
    return <Category key={category._id} category={category} />;
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

      {categories?.length > 0 && !isLoading && <Grid>{categoryList}</Grid>}
      {categories?.length === 0 && !isLoading && (
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
