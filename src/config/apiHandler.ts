import Axios from "axios";
import { ENV } from "./env";
import { setToken, useAuthTokens } from "@/store/useAuthTokens";
import type { AxiosError, AxiosResponse } from "axios";
import { storeTokens } from "@/config/handleTokens";
import { Alert } from "react-native";

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

apiHandler.interceptors.request.use(
  (config) => {
    const { accessToken, refreshToken } = useAuthTokens.getState();
    config.headers.Cookie = `access_token=${accessToken};refresh_token=${refreshToken};`;
    console.log(config);
    return config;
  },
  (error) => {
    Alert.alert("Network Error");
    Promise.reject(error);
  }
);

apiHandler.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (
      response.status === 200 &&
      response.request.responseURL.includes(
        `${ENV.api_base}/auth/google/callback/mobile`
      )
    ) {
      // Extract refreshToken and token from header
      const bearerToken = response.headers.authorization.split(" ")[1];
      const refreshToken = response.headers["refresh-token"];
      // set the token to storage
      await storeTokens(refreshToken, bearerToken);
      // set the same token to zustand
      setToken(refreshToken, bearerToken);
    }

    console.log(response.data, response.request.responseURL);
    return response;
  },
  async (error: AxiosError) => {
    console.log(error);
    if (
      error.response?.status === 401 &&
      error.request.responseURL !== `${ENV.api_base}/auth/refresh`
    ) {
      // Create a promise to retry the original request after the token is refreshed
      const retryOriginalRequest = new Promise((resolve) => {
        refreshQueue.push(() => resolve(apiHandler(error.request)));
      });
      if (!isRefreshing) {
        try {
          isRefreshing = true;
          // new tokens are stored directly to cookies
          await apiHandler.get("/auth/refresh");
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
