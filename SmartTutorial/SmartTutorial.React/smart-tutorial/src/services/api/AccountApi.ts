import { IAccountEditInputs } from "../../components/Account/AccountProfileDetails";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";
import { axiosAuthorized } from "../axios/axios";
import { TokenStorage } from "../localStorage/tokenStorage";
import {
  IServerEditUserError,
  IServerImageUploadError,
} from "./models/errors/IUserErrors";
import {
  IAuthToken,
  ISendRefreshToken,
} from "../../auth/models/authToken/IAuthToken";

export async function editUser(
  data: IAccountEditInputs,
  token: string
): Promise<IServerEditUserError | null> {
  let error: IServerEditUserError = {
    name: "country",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .put(webAPIUrl + "/account/updateProfile", data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      const dataError = err.response.data;
      if (dataError.errors) {
        const serverErrors: string[] = Object.getOwnPropertyNames(
          dataError.errors
        );
        switch (serverErrors[0]) {
          case "Firstname":
            error.name = "firstname";
            error.message = dataError.errors.Firstname;
            break;
          case "Lastname":
            error.name = "lastname";
            error.message = dataError.errors.Lastname;
            break;
          case "Email":
            error.name = "email";
            error.message = dataError.errors.Email;
            break;
          case "Country":
            error.name = "country";
            error.message = dataError.errors.Country;
            break;
          default:
            error.name = "country";
            error.message = "Internal server error. Try again later";
            break;
        }
      } else {
        error.name = "country";
        error.message = dataError;
      }
    });
  if (error.message) {
    return error;
  } else {
    return null;
  }
}

export async function uploadImage(
  data: File,
  token: string
): Promise<IServerImageUploadError | null> {
  let formData = new FormData();
  if (data) {
    formData.append("Avatar", data);
  }
  let error: IServerImageUploadError = {
    name: "image",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .post(webAPIUrl + "/account/uploadImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {})
    .catch((err) => {
      if (err.response) {
        const dataError = err.response.data;
        if (dataError.errors) {
          if (dataError.errors.Avatar) {
            error.message = dataError.errors.Avatar[0];
          }
        } else {
          error.message = dataError;
        }
      }
    });
  if (error.message) {
    return error;
  } else {
    return null;
  }
}

export async function refreshAccessToken(): Promise<IAuthToken | null> {
  let sendRefreshToken: ISendRefreshToken = {
    refreshToken: TokenStorage.getRefreshToken(),
  };
  let result: IAuthToken | null = null;
  await axios
    .post<IAuthToken>(webAPIUrl + "/account/refresh-token", sendRefreshToken)
    .then((res) => {
      result = res.data;
      TokenStorage.setRefreshToken(result.refreshToken.tokenString);
      TokenStorage.setRefreshTokenExpire(
        new Date(result.refreshToken.expireAt)
      );
    })
    .catch((err) => {
      console.log(err.response);
    });
  return result;
}
