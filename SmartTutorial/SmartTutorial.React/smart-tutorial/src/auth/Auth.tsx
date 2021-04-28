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
import { UserForLogin, UserForRegister } from "../data/UserData";
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
  logIn: (user: UserForLogin) => void;
  logOut: () => void;
  signUp: (user: UserForRegister) => void;
}
export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  loading: true,
  logIn: (user: UserForLogin) => {},
  logOut: () => {},
  signUp: (user: UserForRegister) => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage<string>("token", "");

  async function logIn(user: UserForLogin) {
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
          console.log(userData);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    setLoading(true);
    const authenticated = isAuthenticated;
    if (!authenticated) {
      if (token) {
        console.log(token);
        const localUser: IUser = jwt_decode(token);
        console.log(localUser);
        setUser(localUser);
      }
    }
    setIsAuthenticated(!authenticated);
    setLoading(false);
  }, []);

  async function signUp(user: UserForRegister) {
    await axios
      .post(webAPIUrl + "/account/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.passwordConfirm,
      })
      .then((res) => {
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        logIn: logIn,
        logOut: () => {},
        signUp: signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
