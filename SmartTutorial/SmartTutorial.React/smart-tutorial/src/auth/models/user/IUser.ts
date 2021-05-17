import {UserRole} from "../../UserRoles";

export interface IUser {
    username: string;
    email: string;
    country: string;
    firstname: string;
    lastname: string;
    rating: number;
    avatar: string;
    role: UserRole;
}