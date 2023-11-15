import axios from "axios";
import { BACKEND_BASE_URL } from "./api";

const baseUrl = `${BACKEND_BASE_URL}/api/v1/products`;

const productService = {
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
  store: async (newProduct) => {
    const { data } = await axios.post(baseUrl, newProduct, {
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
  update: async (id, productToUpdate) => {
    const { data } = await axios.put(`${baseUrl}/${id}`, productToUpdate, {
      withCredentials: true,
    });
    return data;
  },
  updateMany: async (products) => {
    const { data } = await axios.put(`${baseUrl}`, products, {
      withCredentials: true,
    });
    return data;
  },
};

export default productService;
