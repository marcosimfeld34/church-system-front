import axios from "axios";
import { BACKEND_BASE_URL } from "../services/api";

const baseUrl = `${BACKEND_BASE_URL}/api/v1/users`;

const loginService = {
  login: async (credentials) => {
    const { data } = await axios.post(`${baseUrl}/login`, credentials, {
      withCredentials: true,
    });
    return data;
  },
  register: async (newUser) => {
    const { data } = await axios.post(`${baseUrl}/register`, newUser);
    return data;
  },
  getUser: async (id) => {
    const { data } = await axios.post(`${baseUrl}/profile`, id, {
      withCredentials: true,
    });
    return data;
  },
  update: async (id, userToUpdate) => {
    const { data } = await axios.put(`${baseUrl}/profile/${id}`, userToUpdate, {
      withCredentials: true,
    });
    return data;
  },
  newPassword: async (newPassword) => {
    const { data } = await axios.put(`${baseUrl}/new-password`, newPassword);
    return data;
  },
  recoverPassword: async (email) => {
    const data = axios.put(`${baseUrl}/recovery-password`, email);
    return data;
  },
};

export default loginService;
