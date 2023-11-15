import axios from "axios";
import { BACKEND_BASE_URL } from "./api";

const baseUrl = `${BACKEND_BASE_URL}/api/v1/profiles`;

const profileService = {
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
  getOneByDeveloperName: async (name) => {
    const { data } = await axios.get(`${baseUrl}/developerName/${name}`, {
      withCredentials: true,
    });
    return data;
  },
  store: async (newProfile) => {
    const { data } = await axios.post(baseUrl, newProfile, {
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
  update: async (id, profileToUpdate) => {
    const { data } = await axios.put(`${baseUrl}/${id}`, profileToUpdate, {
      withCredentials: true,
    });
    return data;
  },
};

export default profileService;
