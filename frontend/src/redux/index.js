import axios from "axios";
const isProd = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProd
    ? "https://dzencode-testproject.onrender.com/"
    : "http://localhost:8080/",
  withCredentials: true,
});