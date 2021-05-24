import { createContext, FC, useContext, useEffect, useState } from "react";
import { webAPIUrl } from "../AppSettings";
import axios from "axios";
import useLocalStorage from "../hooks/useLocalStorage";
import { TokenStorage } from "../services/localStorage/tokenStorage";
import { parseJwt } from "../services/jwt/parseJwt";
import { refreshAccessToken } from "../services/api/AccountApi";
import { IUser } from "./models/user/IUser";
import { IAuthToken, ISendRefreshToken } from "./models/authToken/IAuthToken";
import { IAuthContext } from "./models/context/IAuthContext";
import {
  IServerSignInError,
  IServerSignUpError,
} from "./models/errors/IAuthorizationErrors";
import {
  IUserForLogin,
  IUserForRegister,
} from "../services/api/models/user/IUserData";

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  loading: true,
  accessToken: "",
  loginSuccess: false,
  storedUsername: "",
  updateUserInfo: async () => {},
  logIn: async () => null,
  logOut: async () => {},
  signUp: async () => null,
  calmSuccess: () => {},
});

function getUserFromToken(token: any): IUser {
  return {
    username:
      token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    lastname:
      token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"],
    firstname:
      token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],
    country:
      token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country"],
    rating: token["rating"],
    avatar: token["avatar"],
    email:
      token[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    role: token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  };
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loginSuccess, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [accessToken, setAccessToken] = useState<string>("");

  const [storedUsername, setStoredUsername] = useLocalStorage<string>(
    "username",
    ""
  );

  function calmSuccess() {
    setSuccess(false);
  }

  async function updateUserInfo(): Promise<void> {
    let sendRefreshToken: ISendRefreshToken = {
      refreshToken: TokenStorage.getRefreshToken(),
    };
    await axios
      .post<IAuthToken>(webAPIUrl + "/account/refresh-token", sendRefreshToken)
      .then((res) => {
        const token = res.data.accessToken;
        const refreshToken = res.data.refreshToken.tokenString;
        if (token && refreshToken) {
          setAccessToken(token);
          TokenStorage.setRefreshToken(refreshToken);
          TokenStorage.setRefreshTokenExpire(
            new Date(res.data.refreshToken.expireAt)
          );
          const parsedToken = parseJwt(token);
          setUser(getUserFromToken(parsedToken));
        }
      })
      .catch((err) => console.log(err.response));
  }

  async function logIn(
    data: IUserForLogin
  ): Promise<IServerSignInError | null> {
    let error: IServerSignInError = {
      name: "password",
      type: "server",
      message: "",
    };
    setLoading(true);
    await axios
      .post<IAuthToken>(webAPIUrl + "/account/login", {
        username: data.username,
        password: data.password,
        remember: data.remember,
      })
      .then((res) => {
        const token = res.data.accessToken;
        const refreshToken = res.data.refreshToken.tokenString;
        if (token && refreshToken) {
          setAccessToken(token);
          TokenStorage.setRefreshToken(refreshToken);
          TokenStorage.setRefreshTokenExpire(
            new Date(res.data.refreshToken.expireAt)
          );
          const parsedToken = parseJwt(token);
          const userData = getUserFromToken(parsedToken);
          setUser(userData);
          setIsAuthenticated(true);
          setSuccess(true);
          if (data.remember && userData) {
            setStoredUsername(userData.username);
          } else {
            setStoredUsername("");
          }
        }
      })
      .catch((err) => {
        const dataError = err.response.data;
        console.log(dataError);
        if (dataError.errors) {
          const serverErrors: string[] = Object.getOwnPropertyNames(
            dataError.errors
          );
          switch (serverErrors[0]) {
            case "Username":
              error.name = "username";
              error.message = dataError.errors.Username;
              break;
            case "Password":
              error.name = "password";
              error.message = dataError.errors.Password;
              break;
            default:
              error.name = "password";
              error.message = "Internal server error. Try again later";
              break;
          }
        } else {
          error.name = "password";
          error.message = dataError;
        }
      });
    setLoading(false);
    if (error.message) {
      return error;
    } else {
      return null;
    }
  }

  async function signUp(
    user: IUserForRegister
  ): Promise<IServerSignUpError | null> {
    let error: IServerSignUpError = {
      name: "passwordConfirm",
      type: "server",
      message: "",
    };
    setLoading(true);
    await axios
      .post(webAPIUrl + "/account/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.passwordConfirm,
      })
      .then()
      .catch((err) => {
        const dataError = err.response.data;
        console.log(err.response.data);
        if (dataError.errors) {
          const serverErrors: string[] = Object.getOwnPropertyNames(
            dataError.errors
          );
          switch (serverErrors[0]) {
            case "Username":
              error.name = "username";
              error.message = dataError.errors.Username;
              break;
            case "Email":
              error.name = "email";
              error.message = dataError.errors.Email;
              break;
            case "Password":
              error.name = "password";
              error.message = dataError.errors.Password;
              break;
            case "ConfirmPassword":
              error.name = "passwordConfirm";
              error.message = dataError.errors.ConfirmPassword;
              break;
            default:
              error.name = "passwordConfirm";
              error.message = "Internal server Error. Try again later.";
              break;
          }
        } else {
          error.name = "passwordConfirm";
          error.message = dataError;
        }
      });
    setLoading(false);
    if (error.message) {
      return error;
    } else {
      return null;
    }
  }

  async function logOut(): Promise<void> {
    setLoading(true);
    let sendRefreshToken: ISendRefreshToken = {
      refreshToken: TokenStorage.getRefreshToken(),
    };
    await axios
      .post(webAPIUrl + "/account/logout", sendRefreshToken)
      .then(() => {
        TokenStorage.clearTokenStorage();
        setAccessToken("");
        setUser(undefined);
        setIsAuthenticated(false);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }

  useEffect(() => {
    async function refreshToken() {
      const token: IAuthToken | null = await refreshAccessToken();
      if (token) {
        setAccessToken(token.accessToken);
      }
    }
    setLoading(true);
    if (accessToken) {
      const parsedToken = parseJwt(accessToken);
      setUser(getUserFromToken(parsedToken));
      setIsAuthenticated(true);
      setLoading(false);
    } else if (TokenStorage.getRefreshToken()) {
      refreshToken();
    }
    setLoading(false);
  }, [accessToken]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        storedUsername: storedUsername,
        loading,
        updateUserInfo: updateUserInfo,
        loginSuccess,
        logIn: logIn,
        logOut: logOut,
        signUp: signUp,
        calmSuccess: calmSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
