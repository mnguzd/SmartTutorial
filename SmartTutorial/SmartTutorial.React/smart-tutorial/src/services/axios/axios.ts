import axios from "axios";
import { IAuthToken } from "../../auth/Auth";
import { refreshAcessToken } from "../api/AccountApi";
import { parseJwt } from "../jwt/parseJwt";
import { TokenStorage } from "../localStorage/tokenStorage";

export const axiosAuthorized = axios.create();

axiosAuthorized.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosAuthorized.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (TokenStorage.refreshTokenExpired()) {
        TokenStorage.clearTokenStorage(false);
        window.location.href = "/logout";
      } else {
        const accessToken: IAuthToken | null = await refreshAcessToken();
        if (accessToken) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + accessToken.accessToken;
          TokenStorage.setToken(accessToken.accessToken);
          TokenStorage.setRefreshToken(accessToken.refreshToken.tokenString);
          const parsedToken = parseJwt(accessToken.accessToken);
          const date = new Date(0);
          date.setUTCSeconds(parsedToken.exp);
          TokenStorage.setTokenExpire(date);
          TokenStorage.setRefreshTokenExpire(
            new Date(accessToken.refreshToken.expireAt)
          );
        }
      }
      return axiosAuthorized(originalRequest);
    }
    return Promise.reject(error);
  }
);
