import axios from "axios";
import { BACKEND_BASE_URL } from "./api";

const baseUrl = `${BACKEND_BASE_URL}/api/v1/categories`;

const categoryService = {
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
  store: async (newCategory) => {
    const { data } = await axios.post(baseUrl, newCategory, {
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
  update: async (id, categoryToUpdate) => {
    const { data } = await axios.put(`${baseUrl}/${id}`, categoryToUpdate, {
      withCredentials: true,
    });
    return data;
  },
};

export default categoryService;
