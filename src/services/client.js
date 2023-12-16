const CLIENT_URL = `/api/v1/clients`;

const clientService = {
  getAll: async (filters, axiosPrivate) => {
    let finalUrl;

    if (filters.month && filters.year) {
      finalUrl = `${CLIENT_URL}?month=${filters.month}&year=${filters.year}`;
    } else {
      finalUrl = CLIENT_URL;
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    });
    return data;
  },

  getOne: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`${CLIENT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  store: async (newClient, axiosPrivate) => {
    const { data } = await axiosPrivate.post(CLIENT_URL, newClient, {
      withCredentials: true,
    });
    return data;
  },

  delete: async (id, axiosPrivate) => {
    const { data } = await axiosPrivate.delete(`${CLIENT_URL}/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  update: async (id, clientToUpdate, axiosPrivate) => {
    const { data } = await axiosPrivate.put(
      `${CLIENT_URL}/${id}`,
      clientToUpdate,
      {
        withCredentials: true,
      }
    );
    return data;
  },
};

export default clientService;
