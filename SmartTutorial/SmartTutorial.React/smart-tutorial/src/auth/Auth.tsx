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

interface IAuthContext {
  isAuthenticated: boolean;
  user?: IUser;
  loading: boolean;
  loginSuccess:boolean,
  logIn: (user: IUserForLogin) => void;
  logOut: () => void;
  signUp: (user: IUserForRegister) => void;
  getRememberedInfo: () => IRememberedInfo;
  calmSuccess:()=>void;
}
interface IRememberedInfo {
  username: string;
}
export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  loading: true,
  loginSuccess :false,
  logIn:  async () => {},
  logOut: async () => {},
  signUp: async () => {},
  getRememberedInfo: () => {
    return { username: "" };
  },
  calmSuccess:()=>{},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loginSuccess,setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [storedUsername, setStoredUsername] = useLocalStorage<string>(
    "username",
    ""
  );

  function calmSuccess(){
    setSuccess(false);
  }

  function getRememberedInfo(): IRememberedInfo {
    return { username: storedUsername };
  }

  async function logIn(data: IUserForLogin) {
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
        console.log(err);
      });
  }

  async function signUp(user: IUserForRegister) {
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
      .catch((err) => console.log(err));
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
        calmSuccess:calmSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
