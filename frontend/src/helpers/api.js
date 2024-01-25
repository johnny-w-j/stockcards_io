import axios from "axios";

export const backend_api = axios.create({
  // baseURL: "http://127.0.0.1:8000",
  baseURL: "https://api.stockcardsio.link",
});
