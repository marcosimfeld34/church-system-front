import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { useToast } from "@chakra-ui/react";

// components
import CategoryFormAdd from "./CategoryFormAdd";
import CategoryFormEdit from "./CategoryFormEdit";

// services
import categoryService from "../services/category";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";

const CategoryForm = () => {
  const { user, logout } = useAuthContext();
  const { getCategories } = useCategoryContext();
  const toast = useToast();

  const navigate = useNavigate();

  const { categoryId } = useParams();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const onSubmit = async ({ name }) => {
    if (user !== null) {
      let newCategory = {
        name,
      };

      if (!categoryId) {
        try {
          await categoryService.store(newCategory);

          toast({
            position: "top",
            title: "Categoria creada.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });

          navigate("/categories");
        } catch (error) {
          if (
            error.response.data.status === 400 &&
            error.response.data.message === "INVALID_TOKEN"
          ) {
            logout();
          }
          if (
            error.response.data.status === 400 &&
            error.response.data.message === "MISSING_FIELDS_REQUIRED"
          ) {
            console.log(error.response.data.message);
          }
        }
      } else {
        let categoryUpdated = {
          ...categories?.find((c) => c._id === categoryId),
        };

        categoryUpdated.name = name;

        try {
          await categoryService.update(categoryId, categoryUpdated);

          toast({
            position: "top",
            title: "Categoria actualizada.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });

          navigate("/categories");
        } catch (error) {
          if (
            error.response.data.status === 400 &&
            error.response.data.message === "INVALID_TOKEN"
          ) {
            logout();
          } else if (
            error.response.data.status === 400 &&
            error.response.data.message === "MISSING_FIELDS_REQUIRED"
          ) {
            console.log(error.response.data.message);
            // handleSetMessage(MISSING_FIELDS_REQUIRED);
            // handleSetType("danger");
            // handleSetRecordType("budget");
          }
        }
      }
    }
  };

  const onCancelOperation = () => {
    navigate("/categories");
  };

  return (
    <>
      {categoryId && (
        <CategoryFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          categoryToUpdate={{
            ...categories?.find((c) => c._id === categoryId),
          }}
        />
      )}
      {!categoryId && (
        <CategoryFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
        />
      )}
    </>
  );
};

export default CategoryForm;
