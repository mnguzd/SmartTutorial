import axios from "axios";
import { refreshAccessToken } from "../api/AccountApi";
import { TokenStorage } from "../localStorage/tokenStorage";
import {IAuthToken} from "../../auth/models/authToken/IAuthToken";

export const axiosAuthorized = axios.create();

axiosAuthorized.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (TokenStorage.refreshTokenExpired()) {
        TokenStorage.clearTokenStorage();
        window.location.href = "/logout";
      } else {
        const accessToken: IAuthToken | null = await refreshAccessToken();
        if (accessToken) {
          originalRequest.headers.Authorization =
            "Bearer " + accessToken.accessToken;
        }
      }
      return axiosAuthorized(originalRequest);
    }
    return Promise.reject(error);
  }
);
