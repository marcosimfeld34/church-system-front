import { useNavigate, useParams, useLocation } from "react-router-dom";

// components
import CategoryFormAdd from "./CategoryFormAdd";
import CategoryFormEdit from "./CategoryFormEdit";

// custom hooks
import { useCategories } from "../hooks/useCategories";
import { useNewCategory } from "../hooks/useNewCategory";
import { useEditCategory } from "../hooks/useEditCategory";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";

const CategoryForm = () => {
  const { showMessage } = useMessage();

  const navigate = useNavigate();

  const { categoryId } = useParams();
  const { logout } = useLogout();
  const location = useLocation();

  const queryCategories = useCategories();
  const { addNewCategory } = useNewCategory();
  const { editCategory } = useEditCategory();

  const onSubmit = async ({ name }) => {
    let newCategory = {
      name,
    };

    if (!categoryId) {
      try {
        await addNewCategory(newCategory);

        showMessage("Categoria creada.", "success", "purple");

        navigate("/categories");
      } catch (error) {
        if (error?.response?.status === 403) {
          logout().then((res) => {
            if (res.loggedOut) {
              showMessage("Venció la sesión", "success", "purple");
              navigate("/login", { state: { from: location }, replace: true });
            }
          });
        }
        if (error?.response?.status === 400) {
          showMessage("Ocurrió un error", "success", "purple");
        }
      }
    } else {
      let categoryUpdated = {
        ...queryCategories?.data?.find((c) => c._id === categoryId),
      };

      categoryUpdated.name = name;

      try {
        await editCategory({ categoryId, categoryToUpdate: categoryUpdated });

        showMessage("Categoria actualizada.", "success", "purple");

        navigate("/categories");
      } catch (error) {
        if (error?.response?.status === 403) {
          logout().then((res) => {
            if (res.loggedOut) {
              showMessage("Venció la sesión", "success", "purple");
              navigate("/login", { state: { from: location }, replace: true });
            }
          });
        } else if (error?.response?.status === 400) {
          showMessage("Ocurrió un error", "success", "purple");
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
            ...queryCategories?.data?.find((c) => c._id === categoryId),
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
