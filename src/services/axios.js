import axios from "axios";
const BASE_URL = "https://church-system-dev-pmhk.4.us-1.fl0.io";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
