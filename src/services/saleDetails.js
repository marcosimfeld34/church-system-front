const SALEDETAIL_URL = "/api/v1/saleDetails";

const saleDetailService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.startDate && filters.endDate) {
      finalUrl = `${SALEDETAIL_URL}?startDate=${filters.startDate}&endDate=${filters.endDate}`;
    } else {
      finalUrl = SALEDETAIL_URL;
    }
    finalUrl = finalUrl + `&all=${filters.all}`;

    if (filters.historyMonthToRetrieve) {
      finalUrl =
        finalUrl + `&historyMonthToRetrieve=${filters.historyMonthToRetrieve}`;
    }

    if (filters.saleId) {
      finalUrl = finalUrl + `&saleId=${filters.saleId}`;
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
