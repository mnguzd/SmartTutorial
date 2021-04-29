import React, {
  useState,
  useContext,
  createContext,
  FC,
  useEffect,
} from "react";
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
  logIn: (user: IUserForLogin) => void;
  logOut: () => void;
  signUp: (user: IUserForRegister) => void;
}
export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  loading: true,
  logIn: () => {},
  logOut: () => {},
  signUp: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage<string>("token", "");

  async function logIn(user: IUserForLogin) {
    await axios
      .post<IAuthToken>(webAPIUrl + "/account/login", {
        username: user.username,
        password: user.password,
      })
      .then((res) => {
        const token = res.data.accessToken;
        if (token) {
          setToken(token);
          const userData: IUser = jwt_decode(token);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
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
        logIn: logIn,
        logOut: logOut,
        signUp: signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
