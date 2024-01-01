const METHOD_PAYMENT_URL = `/api/v1/methodPayments`;

const methodPaymentService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.id) {
      finalUrl = `${METHOD_PAYMENT_URL}?id=${filters.id}`;
    } else {
      finalUrl = METHOD_PAYMENT_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },

  getOne: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`${METHOD_PAYMENT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  store: async (newMethodPayment, axiosPrivate) => {
    const { data } = await axiosPrivate.post(
      METHOD_PAYMENT_URL,
      newMethodPayment,
      {
        withCredentials: true,
      }
    );
    return data;
  },

  delete: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.delete(`${METHOD_PAYMENT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  update: async (id, methodPaymentToUpdate, axiosPrivate) => {
    const { data } = await axiosPrivate.put(
      `${METHOD_PAYMENT_URL}/${id}`,
      methodPaymentToUpdate,
      {
        withCredentials: true,
      }
    );
    return data;
  },
};

export default methodPaymentService;
