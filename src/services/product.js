const PRODUCT_URL = "/api/v1/products";

const productService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.id) {
      finalUrl = `${PRODUCT_URL}?id=${filters.id}`;
    } else {
      finalUrl = PRODUCT_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },
  getOne: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`${PRODUCT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (newProduct, axiosPrivate) => {
    const { data } = await axiosPrivate.post(PRODUCT_URL, newProduct, {
      withCredentials: true,
    });
    return data;
  },
  delete: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.delete(`${PRODUCT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  update: async (id, productToUpdate, axiosPrivate) => {
    const { data } = await axiosPrivate.put(
      `${PRODUCT_URL}/${id}`,
      productToUpdate,
      {
        withCredentials: true,
      }
    );
    return data;
  },
  updateMany: async (products, axiosPrivate) => {
    const { data } = await axiosPrivate.put(`${PRODUCT_URL}`, products, {
      withCredentials: true,
    });
    return data;
  },
};

export default productService;
