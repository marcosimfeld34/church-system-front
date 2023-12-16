const SALE_URL = "/api/v1/sales";

const saleService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.month && filters.year) {
      finalUrl = `${SALE_URL}?month=${filters.month}&year=${filters.year}`;
    } else {
      finalUrl = SALE_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },
  getOne: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`${SALE_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (newSale, axiosPrivate) => {
    const { data } = await axiosPrivate.post(SALE_URL, newSale, {
      withCredentials: true,
    });
    return data;
  },
  delete: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.delete(`${SALE_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  update: async (id, saleToUpdate, axiosPrivate) => {
    const { data } = await axiosPrivate.put(`${SALE_URL}/${id}`, saleToUpdate, {
      withCredentials: true,
    });
    return data;
  },
};

export default saleService;
