import { useNavigate, useParams, useLocation } from "react-router-dom";
// components
import ProductFormAdd from "./ProductFormAdd";
import ProductFormEdit from "./ProductFormEdit";

// custom hooks
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useNewProduct } from "../hooks/useNewProduct";
import { useEditProduct } from "../hooks/useEditProduct";
import { useLogout } from "../hooks/useLogout";
import { useMessage } from "../hooks/useMessage";

const ProductForm = () => {
  const { showMessage } = useMessage();

  const navigate = useNavigate();
  const { logout } = useLogout();
  const location = useLocation();

  const { productId } = useParams();

  const queryProducts = useProducts();
  const queryCategories = useCategories();

  const { addNewProduct } = useNewProduct();
  const { editProduct } = useEditProduct();

  const onSubmit = async ({
    name,
    costPrice,
    salePrice,
    salePorcentage,
    category,
    stock,
  }) => {
    let newProduct = {
      name,
      costPrice,
      salePrice,
      salePorcentage,
      category,
      stock,
    };

    newProduct.salePorcentage = (salePrice / costPrice - 1) * 100;

    if (!productId) {
      try {
        await addNewProduct(newProduct);

        showMessage("Producto creado.", "success", "purple");

        navigate("/products");
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
    } else {
      let productUpdated = {
        ...queryProducts?.data?.find((p) => p._id === productId),
      };

      productUpdated.name = name;
      productUpdated.costPrice = Number.parseFloat(costPrice);
      productUpdated.category = category;
      productUpdated.stock = Number.parseFloat(stock);
      productUpdated.salePrice = Number.parseFloat(salePrice);
      productUpdated.salePorcentage = (salePrice / costPrice - 1) * 100;

      try {
        await editProduct({ productId, productToUpdate: productUpdated });

        showMessage("Producto actualizado.", "success", "purple");

        navigate("/products");
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
    navigate("/products");
  };

  return (
    <>
      {productId && (
        <ProductFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          productToUpdate={{
            ...queryProducts?.data?.find((p) => p._id === productId),
          }}
          categories={queryCategories?.data}
        />
      )}
      {!productId && (
        <ProductFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          categories={queryCategories?.data}
        />
      )}
    </>
  );
};

export default ProductForm;
