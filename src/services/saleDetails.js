import axios from "axios";
import { BACKEND_BASE_URL } from "./api";

const baseUrl = `${BACKEND_BASE_URL}/api/v1/saleDetails`;

const saleDetailService = {
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
  store: async (newSaleDetails) => {
    const { data } = await axios.post(baseUrl, newSaleDetails, {
      withCredentials: true,
    });
    return data;
  },
  storeMany: async (newSaleDetails) => {
    const { data } = await axios.post(baseUrl, newSaleDetails, {
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
  deleteMany: async (saleDetailIds) => {
    const { data } = await axios.put(`${baseUrl}/deleteMany`, saleDetailIds, {
      withCredentials: true,
    });
    return data;
  },
  updateMany: async (saleDetailsToUpdate) => {
    const { data } = await axios.put(`${baseUrl}`, saleDetailsToUpdate, {
      withCredentials: true,
    });
    return data;
  },
};

export default saleDetailService;
