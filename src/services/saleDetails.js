const SALEDETAIL_URL = "/api/v1/saleDetails";

const saleDetailService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.month && filters.year) {
      finalUrl = `${SALEDETAIL_URL}?month=${filters.month}&year=${filters.year}`;
    } else {
      finalUrl = SALEDETAIL_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },
  getOne: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`${SALEDETAIL_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (newSaleDetails, axiosPrivate) => {
    const { data } = await axiosPrivate.post(SALEDETAIL_URL, newSaleDetails, {
      withCredentials: true,
    });
    return data;
  },
  storeMany: async (newSaleDetails, axiosPrivate) => {
    const { data } = await axiosPrivate.post(SALEDETAIL_URL, newSaleDetails, {
      withCredentials: true,
    });
    return data;
  },
  delete: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.delete(`${SALEDETAIL_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  deleteMany: async (saleDetailIds, axiosPrivate) => {
    const { data } = await axiosPrivate.put(
      `${SALEDETAIL_URL}/deleteMany`,
      saleDetailIds,
      {
        withCredentials: true,
      }
    );
    return data;
  },
  updateMany: async (saleDetailsToUpdate, axiosPrivate) => {
    const { data } = await axiosPrivate.put(
      `${SALEDETAIL_URL}`,
      saleDetailsToUpdate,
      {
        withCredentials: true,
      }
    );
    return data;
  },
};

export default saleDetailService;
