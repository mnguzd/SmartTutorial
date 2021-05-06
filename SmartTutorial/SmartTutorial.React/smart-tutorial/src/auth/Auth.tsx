import { useState, useContext, createContext, FC, useEffect } from "react";
import { webAPIUrl } from "../AppSettings";
import axios from "axios";
import { IUserForLogin, IUserForRegister } from "../data/UserData";
import useLocalStorage from "../hooks/useLocalStorage";

export interface IUser {
  username: string;
  email: string;
  country: string;
  firstname: string;
  lastname: string;
  rating: number;
  avatar: string;
}

export interface IUpdatedUserInfo {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  country: string;
}

interface IAuthToken {
  accessToken: string;
  refreshToken: IRefreshToken;
}

interface IRefreshToken {
  username: string;
  tokenString: string;
  expireAt: string;
}

interface ISendRefreshToken {
  refreshToken: string;
}

export interface IServerSignUpError {
  name: "password" | "username" | "email" | "passwordConfirm";
  type: string;
  message: string;
}
export interface IServerSignInError {
  name: "username" | "remember" | "password";
  type: string;
  message: string;
}

interface IAuthContext {
  isAuthenticated: boolean;
  user?: IUser;
  storedUsername: string;
  loading: boolean;
  token: string;
  loginSuccess: boolean;
  updateUserInfo: () => Promise<void>;
  logIn: (user: IUserForLogin) => Promise<IServerSignInError | null>;
  logOut: () => void;
  signUp: (user: IUserForRegister) => Promise<IServerSignUpError | null>;
  calmSuccess: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  loading: true,
  loginSuccess: false,
  storedUsername: "",
  token: "",
  updateUserInfo: async () => {},
  logIn: async () => null,
  logOut: async () => {},
  signUp: async () => null,
  calmSuccess: () => {},
});

function getUserFromToken(token: any): IUser {
  const userData: IUser = {
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
  };
  return userData;
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loginSuccess, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [refreshToken, setRefreshToken] = useLocalStorage<string>(
    "refreshToken",
    ""
  );
  const [storedUsername, setStoredUsername] = useLocalStorage<string>(
    "username",
    ""
  );
  function calmSuccess() {
    setSuccess(false);
  }
  async function updateUserInfo(): Promise<void> {
    let sendRefreshToken: ISendRefreshToken = {
      refreshToken: refreshToken,
    };
    await axios
      .post<IAuthToken>(
        webAPIUrl + "/account/refresh-token",
        sendRefreshToken,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const token = res.data.accessToken;
        const refreshToken = res.data.refreshToken.tokenString;
        if (token && refreshToken) {
          setToken(token);
          setRefreshToken(refreshToken);
          const parsedToken = parseJwt(token);
          setUser(getUserFromToken(parsedToken));
        }
      });
  }
  async function logIn(
    data: IUserForLogin
  ): Promise<IServerSignInError | null> {
    let error: IServerSignInError = {
      name: "password",
      type: "server",
      message: "",
    };
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
          setToken(token);
          setRefreshToken(refreshToken);
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
          setLoading(false);
        }
      })
      .catch((err) => {
        const dataError = err.response.data;
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
            case "message":
              error.name = "password";
              error.message = dataError.errors.message;
              break;
            default:
              error.name = "password";
              error.message = "Internal server error. Try again later";
              break;
          }
        }
      });
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
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        const dataError = err.response.data;
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
            case "message":
              error.name = "passwordConfirm";
              error.message = dataError.errors.message;
              break;
            default:
              error.name = "passwordConfirm";
              error.message = "Internal server Error. Try again later.";
              break;
          }
        }
      });
    if (error.message) {
      return error;
    } else {
      return null;
    }
  }

  async function logOut(): Promise<void> {
    setLoading(true);
    await axios
      .post(webAPIUrl + "/account/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (token && refreshToken) {
          setToken("");
          setRefreshToken("");
        }
        setUser(undefined);
        setIsAuthenticated(false);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated === false) {
      if (token) {
        const parsedToken = parseJwt(token);
        setUser(getUserFromToken(parsedToken));
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, [isAuthenticated, token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        storedUsername: storedUsername,
        loading,
        updateUserInfo: updateUserInfo,
        token: token,
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

function parseJwt(token: string): any {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
