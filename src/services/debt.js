const DEBT_URL = "/api/v1/debts";

const debtService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.id) {
      finalUrl = `${DEBT_URL}?id=${filters.id}`;
    } else {
      finalUrl = DEBT_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },
  getOne: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`${DEBT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (newDebt, axiosPrivate) => {
    const { data } = await axiosPrivate.post(DEBT_URL, newDebt, {
      withCredentials: true,
    });
    return data;
  },
  delete: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.delete(`${DEBT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  update: async (id, debtToUpdate, axiosPrivate) => {
    const { data } = await axiosPrivate.put(`${DEBT_URL}/${id}`, debtToUpdate, {
      withCredentials: true,
    });
    return data;
  },
};

export default debtService;
