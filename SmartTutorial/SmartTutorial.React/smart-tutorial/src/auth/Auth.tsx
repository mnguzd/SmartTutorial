import React, {
  useState,
  useContext,
  createContext,
  FC,
} from "react";
import { webAPIUrl } from "../AppSettings";
import axios from "axios";
import jwt_decode from "jwt-decode";
import UserForLogin from "./../data/UserForLogin";

interface IUser {
  username: string;
}
interface IAuthToken {
  accessToken: string;
}

interface IAuthContext {
  isAuthenticated: boolean;
  user?: IUser;
  logIn: (user: UserForLogin) => void;
  logOut: () => void;
}
export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  logIn: (user: UserForLogin) => {},
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  async function logIn(user: UserForLogin) {
    await axios
      .post<IAuthToken>(webAPIUrl + "/account/login", {
        username: user.username,
        password: user.password,
      })
      .then((res) => {
        const token = res.data.accessToken;
        if (token) {
          const userData: IUser = jwt_decode(token);
          console.log(userData);
          setUser(userData);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logIn: logIn,
        logOut: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
