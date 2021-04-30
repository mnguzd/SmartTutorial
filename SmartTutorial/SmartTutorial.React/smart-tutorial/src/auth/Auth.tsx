import { useState, useContext, createContext, FC, useEffect } from "react";
import { webAPIUrl } from "../AppSettings";
import axios from "axios";
import { IUserForLogin, IUserForRegister } from "../data/UserData";
import useLocalStorage from "../hooks/useLocalStorage";

interface IUser {
  username: string;
}
interface IAuthToken {
  accessToken: string;
}
interface IRememberedInfo {
  username: string;
}
export interface IServerSignUpError {
  name: "password" | "username" | "email" | "passwordConfirm";
  type: string;
  message: string;
}
export interface IServerSignInError{
  name: "username" | "remember" | "password";
  type: string;
  message: string;
}

interface IAuthContext {
  isAuthenticated: boolean;
  user?: IUser;
  loading: boolean;
  loginSuccess: boolean;
  logIn: (user: IUserForLogin) => Promise<IServerSignInError | null>;
  logOut: () => void;
  signUp: (user: IUserForRegister) => Promise<IServerSignUpError | null>;
  getRememberedInfo: () => IRememberedInfo;
  calmSuccess: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  loading: true,
  loginSuccess: false,
  logIn: async () => null,
  logOut: async () => {},
  signUp: async () => null,
  getRememberedInfo: () => {
    return { username: "" };
  },
  calmSuccess: () => {},
});

export const useAuth = () => useContext(AuthContext);

function parseJwt (token:string):any {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

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

  function calmSuccess() {
    setSuccess(false);
  }

  function getRememberedInfo(): IRememberedInfo {
    return { username: storedUsername };
  }
  async function logIn(data: IUserForLogin): Promise<IServerSignInError | null> {
    let error: IServerSignInError = { name: "password", type: "server", message: "" };
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

  async function signUp(user: IUserForRegister): Promise<IServerSignUpError | null> {
    let error: IServerSignUpError = { name: "passwordConfirm", type: "server", message: "" };
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
      .post(webAPIUrl + "/account/logout",null,{ headers: {"Authorization" : `Bearer ${token}`} })
      .then(() => {
        if (token) {
          setToken("");
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
        const localUser: IUser = parseJwt(token);
        setUser(localUser);
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
        loading,
        loginSuccess,
        logIn: logIn,
        logOut: logOut,
        signUp: signUp,
        getRememberedInfo: getRememberedInfo,
        calmSuccess: calmSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
