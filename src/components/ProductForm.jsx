import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";
// components
import ProductFormAdd from "./ProductFormAdd";
import ProductFormEdit from "./ProductFormEdit";

// services
import productService from "../services/product";

// custom hooks
import { useProductContext } from "../hooks/useProductContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";

const ProductForm = () => {
  const { user, logout } = useAuthContext();

  const { getProducts } = useProductContext();

  const { getCategories } = useCategoryContext();

  const toast = useToast();

  const navigate = useNavigate();

  const { productId } = useParams();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const onSubmit = async ({
    name,
    costPrice,
    salePrice,
    salePorcentage,
    category,
    stock,
  }) => {
    if (user !== null) {
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
          await productService.store(newProduct);

          toast({
            position: "top",
            title: "Producto creado.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });

          navigate("/products");
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
        let productUpdated = { ...products?.find((p) => p._id === productId) };

        productUpdated.name = name;
        productUpdated.costPrice = Number.parseFloat(costPrice);
        productUpdated.category = category;
        productUpdated.stock = Number.parseFloat(stock);
        productUpdated.salePrice = Number.parseFloat(salePrice);
        productUpdated.salePorcentage = (salePrice / costPrice - 1) * 100;

        try {
          await productService.update(productId, productUpdated);

          toast({
            position: "top",
            title: "Producto actualizado.",
            status: "success",
            duration: 3000,
            isClosable: true,
            colorScheme: "purple",
          });
          navigate("/products");
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
    navigate("/products");
  };

  return (
    <>
      {productId && (
        <ProductFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          productToUpdate={{ ...products?.find((p) => p._id === productId) }}
          categories={categories}
        />
      )}
      {!productId && (
        <ProductFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          categories={categories}
        />
      )}
    </>
  );
};

export default ProductForm;
