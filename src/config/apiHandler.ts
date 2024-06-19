import Axios from "axios";
import { ENV } from "./env";

export const apiHandler = Axios.create({
  baseURL: ENV.api_base,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
