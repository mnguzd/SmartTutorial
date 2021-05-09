import axios from "axios";
import { IAuthToken } from "../../auth/Auth";
import { refreshAcessToken } from "../api/AccountApi";
import { TokenStorage } from "../localStorage/tokenStorage";

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
        const accessToken: IAuthToken | null = await refreshAcessToken();
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
