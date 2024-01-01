import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// components
import ProductAddEditForm from "./ProductAddEditForm";

// custom hooks
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useNewProduct } from "../../hooks/useNewProduct";
import { useEditProduct } from "../../hooks/useEditProduct";
import { useMessage } from "../../hooks/useMessage";
import { useError } from "../../hooks/useError";

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants";

const ProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { throwError } = useError();
  const { showMessage } = useMessage();

  const navigate = useNavigate();

  const { productId } = useParams();

  const queryProducts = useProducts({ id: productId });
  const productToUpdate = queryProducts?.data
    ? { ...queryProducts?.data[0] }
    : {};
  const queryCategories = useCategories();

  const { addNewProduct } = useNewProduct();
  const { editProduct } = useEditProduct();

  const onSubmit = async ({ name, costPrice, salePrice, category, stock }) => {
    setIsLoading(true);

    try {
      let response;
      if (!productId) {
        response = await addNewProduct({
          name,
          costPrice,
          salePrice,
          salePorcentage: (salePrice / costPrice - 1) * 100,
          category,
          stock,
        });
        if (response.isStored) {
          showMessage(RECORD_CREATED, "success", "purple");
        }
      } else {
        productToUpdate.name = name;
        productToUpdate.costPrice = Number.parseFloat(costPrice);
        productToUpdate.category = category;
        productToUpdate.stock = Number.parseFloat(stock);
        productToUpdate.salePrice = Number.parseFloat(salePrice);
        productToUpdate.salePorcentage = (salePrice / costPrice - 1) * 100;
        response = await editProduct({ productId, productToUpdate });
        if (response.isUpdated) {
          showMessage(RECORD_UPDATED, "success", "purple");
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/products");
      }
    } catch (error) {
      throwError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelOperation = () => {
    navigate("/products");
  };

  return (
    <ProductAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      productToUpdate={productId ? productToUpdate : {}}
      categories={queryCategories?.data}
      isEditing={productId ? true : false}
      isLoading={isLoading}
    />
  );
};

export default ProductForm;
