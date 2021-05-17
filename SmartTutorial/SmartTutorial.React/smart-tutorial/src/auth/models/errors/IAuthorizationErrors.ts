export interface IServerSignUpError {
    name: "password" | "username" | "email" | "passwordConfirm";
    type: string;
    message: string;
}

export interface IServerSignInError {
    name: "username" | "remember" | "password";
    type: string;
    message: string;
}