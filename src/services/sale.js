const SALE_URL = "/api/v1/sales";

const saleService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;
    if (!filters.id && filters.startDate && filters.endDate) {
      finalUrl = `${SALE_URL}?startDate=${filters.startDate}&endDate=${filters.endDate}`;
    } else if (filters.id) {
      finalUrl = `${SALE_URL}?id=${filters.id}`;
    } else {
      finalUrl = SALE_URL;
    }

    finalUrl = finalUrl + `&all=${filters.all}`;

    if (filters.historyMonthToRetrieve) {
      finalUrl =
        finalUrl + `&historyMonthToRetrieve=${filters.historyMonthToRetrieve}`;
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
