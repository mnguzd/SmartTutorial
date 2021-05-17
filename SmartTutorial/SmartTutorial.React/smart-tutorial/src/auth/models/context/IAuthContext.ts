import {IUser} from "../user/IUser";
import {IServerSignInError, IServerSignUpError} from "../errors/IAuthorizationErrors";
import {IUserForLogin, IUserForRegister} from "../../../services/api/models/user/IUserData";

export interface IAuthContext {
    isAuthenticated: boolean;
    user?: IUser;
    accessToken: string;
    storedUsername: string;
    loading: boolean;
    loginSuccess: boolean;
    updateUserInfo: () => Promise<void>;
    logIn: (user: IUserForLogin) => Promise<IServerSignInError | null>;
    logOut: () => Promise<void>;
    signUp: (user: IUserForRegister) => Promise<IServerSignUpError | null>;
    calmSuccess: () => void;
}