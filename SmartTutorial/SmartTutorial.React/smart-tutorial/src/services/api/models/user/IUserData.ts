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
