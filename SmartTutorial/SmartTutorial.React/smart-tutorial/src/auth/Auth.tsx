import { useState, useContext, createContext, FC, useEffect } from "react";
import { webAPIUrl } from "../AppSettings";
import axios from "axios";
import jwt_decode from "jwt-decode";
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
export interface IServerError {
  name: string;
  type: string;
  message: string;
}

interface IAuthContext {
  isAuthenticated: boolean;
  user?: IUser;
  loading: boolean;
  loginSuccess: boolean;
  logIn: (user: IUserForLogin) => Promise<IServerError | null>;
  logOut: () => void;
  signUp: (user: IUserForRegister) => Promise<IServerError | null>;
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

  async function logIn(data: IUserForLogin): Promise<IServerError | null> {
    let error: IServerError = { name: "", type: "server", message: "" };
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
          const userData: IUser = jwt_decode(token);
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
        if (dataError.status) {
          if (dataError.status.toString() === "401") {
            error.name = "password";
            error.message = "Can't find user with such credentials";
          }
        }
        if (dataError.errors) {
          if (dataError.errors.Username) {
            error.name = "username";
            error.message = dataError.errors.Username;
          } else if (dataError.errors.Password) {
            error.name = "password";
            error.message = dataError.errors.Password;
          }
        }
      });
    if (error.message) {
      return error;
    } else {
      return null;
    }
  }

  async function signUp(user: IUserForRegister): Promise<IServerError | null> {
    let error: IServerError = { name: "", type: "server", message: "" };
    await axios
      .post(webAPIUrl + "/account/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.passwordConfirm,
      })
      .then((res) => {
        setLoading(false);
        console.log(res.status);
      })
      .catch((err) => {
        const dataError = err.response.data;
        if(dataError.status){
          if(dataError.status.toString()==="Error"){
            error.name = "passwordConfirm";
            error.message = dataError.message;
          }
        }
        if (dataError.errors) {
          if (dataError.errors.Username) {
            error.name = "username";
            error.message = dataError.errors.Username;
          } else if (dataError.errors.Email) {
            error.name = "email";
            error.message = dataError.errors.Email;
          } else if (dataError.errors.Password) {
            error.name = "password";
            error.message = dataError.errors.Password;
          } else if (dataError.errors.ConfirmPassword) {
            error.name = "passwordConfirm";
            error.message = dataError.errors.ConfirmPassword;
          } else if (dataError.errors.description) {
            error.name = "passwordConfirm";
            error.message = dataError.errors.description;
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
    await axios
      .post(webAPIUrl + "/account/logout")
      .then(() => {
        if (token) {
          setToken("");
        }
        setUser(undefined);
        setIsAuthenticated(false);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated === false) {
      if (token) {
        const localUser: IUser = jwt_decode(token);
        setUser(localUser);
        setIsAuthenticated(true);
        setLoading(false);
      }
    }
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
