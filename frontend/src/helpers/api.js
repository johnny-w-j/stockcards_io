import axios from "axios";

export const backend_api = axios.create({
  baseURL: "http://ec2-34-197-105-156.compute-1.amazonaws.com:8000",
});
