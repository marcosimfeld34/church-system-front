const CATEGORY_URL = "/api/v1/categories";

const categoryService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.id) {
      finalUrl = `${CATEGORY_URL}?id=${filters.id}`;
    } else {
      finalUrl = CATEGORY_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },
  getOne: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`${CATEGORY_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (newCategory, axiosPrivate) => {
    const { data } = await axiosPrivate.post(CATEGORY_URL, newCategory, {
      withCredentials: true,
    });
    return data;
  },
  delete: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.delete(`${CATEGORY_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  update: async (id, categoryToUpdate, axiosPrivate) => {
    const { data } = await axiosPrivate.put(
      `${CATEGORY_URL}/${id}`,
      categoryToUpdate,
      {
        withCredentials: true,
      }
    );
    return data;
  },
};

export default categoryService;
