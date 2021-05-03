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
  userLocalAuthenticated: boolean;
  loginSuccess: boolean;
  updateUserInfo:(data:IUpdatedUserInfo) =>void;
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
  updateUserInfo :()=>{},
  userLocalAuthenticated: false,
  logIn: async () => null,
  logOut: async () => {},
  signUp: async () => null,
  calmSuccess: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loginSuccess, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [storedUsername, setStoredUsername] = useLocalStorage<string>(
    "username",
    ""
  );
  const [
    userLocalAuthenticated,
    setUserLocalAuthenticated,
  ] = useLocalStorage<boolean>("authenticated", false);

  function calmSuccess() {
    setSuccess(false);
  }
  function updateUserInfo(data: IUpdatedUserInfo) {
    if (user) {
        let newData:IUser = {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        country: data.country,
        rating: user.rating,
      };
      setUser(newData);
    }
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
        if (token) {
          setToken(token);
          const userData: IUser = parseJwt(token);
          setUser(userData);
          setIsAuthenticated(true);
          setUserLocalAuthenticated(true);
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

  async function logOut() {
    setLoading(false);
    await axios
      .post(webAPIUrl + "/account/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (token) {
          setToken("");
        }
        setUser(undefined);
        setIsAuthenticated(false);
        setUserLocalAuthenticated(false);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated === false) {
      if (token) {
        const localUser: IUser = parseJwt(token);
        setUser(localUser);
        setIsAuthenticated(true);
        setUserLocalAuthenticated(true);
      }
    }
    setLoading(false);
  }, [isAuthenticated, token, setUserLocalAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        storedUsername: storedUsername,
        loading,
        updateUserInfo:updateUserInfo,
        token: token,
        loginSuccess,
        userLocalAuthenticated,
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
