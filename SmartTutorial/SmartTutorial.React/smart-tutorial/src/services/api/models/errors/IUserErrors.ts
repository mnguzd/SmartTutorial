export interface IServerImageUploadError {
    name: "image";
    type: string;
    message: string;
}

export interface IServerEditUserError {
    name: "firstname" | "lastname" | "email" | "country";
    type: string;
    message: string;
}