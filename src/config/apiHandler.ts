import Axios from "axios";
import { ENV } from "./env";
import { useAuthTokens } from "@/store/useAuthTokens";
import type { AxiosError, AxiosResponse } from "axios";
import { storeTokens } from "@/config/handleTokens";

export const apiHandler = Axios.create({
  baseURL: ENV.api_base,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

apiHandler.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.status === 200 &&
      response.request.responseURL ===
        `${ENV.api_base}/auth/google/callback/mobile`
    ) {
      // Extract refreshToken and token from header
      const bearerToken = response.headers.Authorization.split(" ")[1];
      const refreshToken = response.headers["Refresh-Token"];
      // set the token to storage
      storeTokens(refreshToken, bearerToken)
        .then(() => console.log("Token Saved successfully"))
        .then((error) => console.warn(error));
      // set the same token to zustand
      const { setToken } = useAuthTokens();
      setToken(refreshToken, bearerToken);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      error.request.responseURL !== `${ENV.api_base}/auth/refresh`
    ) {
      const originalRequestURL = window.location.href;
      // Create a promise to retry the original request after the token is refreshed
      const retryOriginalRequest = new Promise((resolve) => {
        refreshQueue.push(() => resolve(apiHandler(error.request)));
      });
      if (!isRefreshing) {
        try {
          isRefreshing = true;
          // new tokens are stored directly to cookies
          await apiHandler.get("/auth/refresh");
          window.location.href = originalRequestURL;
        } catch (refreshError) {
          isRefreshing = false;
          throw new Error();
        } finally {
          isRefreshing = false;
        }

        // Replay the queued requests
        for (const resolve of refreshQueue) {
          resolve();
        }
        refreshQueue = [];
      }

      return retryOriginalRequest;
    }

    // this will return to the function that made this interceptor to call
    // error should be handle from the catch block of that function
    return Promise.reject(error);
  }
);
