export interface IUserForLogin {
  username: string;
  password: string;
  remember: boolean;
}

export interface IUserForRegister {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
export interface IAddToRole {
  userName: string;
  role: string;
}
export interface IUserTableData {
  id: number;
  rating: number;
  country: string;
  role: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatarPath: string;
}
