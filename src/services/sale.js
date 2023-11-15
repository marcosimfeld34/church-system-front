import axios from "axios";
import { BACKEND_BASE_URL } from "./api";

const baseUrl = `${BACKEND_BASE_URL}/api/v1/sales`;

const saleService = {
  getAll: async (filters) => {
    let finalUrl;

    if (filters.month && filters.year) {
      finalUrl = `${baseUrl}?month=${filters.month}&year=${filters.year}`;
    } else {
      finalUrl = baseUrl;
    }

    const { data } = await axios.get(finalUrl, { withCredentials: true });
    return data;
  },
  getOne: async (id) => {
    const { data } = await axios.get(`${baseUrl}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (newSale) => {
    const { data } = await axios.post(baseUrl, newSale, {
      withCredentials: true,
    });
    return data;
  },
  delete: async (id) => {
    const { data } = await axios.delete(`${baseUrl}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  update: async (id, saleToUpdate) => {
    const { data } = await axios.put(`${baseUrl}/${id}`, saleToUpdate, {
      withCredentials: true,
    });
    return data;
  },
};

export default saleService;
