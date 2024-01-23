import axios from "axios";

export const backend_api = axios.create({
  // baseURL: "http://127.0.0.1:8000",
  baseURL: "http://ec2-34-197-105-156.compute-1.amazonaws.com:8000",
});
