import { IAccountEditInputs } from "../../components/Account/AccountProfileDetails";
import { IUpdatedUserInfo } from "../../auth/Auth";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";

export interface IServerImageUploadError {
  name: "image";
  type: string;
  message: string;
}

export async function editUser(
  data: IAccountEditInputs,
  token: string
): Promise<IUpdatedUserInfo | undefined> {
  let updatedUser: IUpdatedUserInfo | undefined = undefined;
  await axios
    .patch(webAPIUrl + "/account/patch", data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      updatedUser = response.data;
    })
    .catch((err) => console.log(err));
  if (updatedUser) {
    return updatedUser;
  } else {
    return undefined;
  }
}

export async function uploadImage(
  data: File,
  token: string
): Promise<IServerImageUploadError | null> {
  let formData = new FormData();
  formData.append("Avatar", data);
  let error: IServerImageUploadError = {
    name: "image",
    type: "server",
    message: "",
  };
  await axios
    .post(webAPIUrl + "/account/uploadImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {})
    .catch((err) => {
      const dataError = err.response.data;
      if (dataError.errors) {
        if (dataError.errors.Avatar) {
          error.message = dataError.errors.Avatar[0];
        }
      }
    });
  if (error.message) {
    return error;
  } else {
    return null;
  }
}
