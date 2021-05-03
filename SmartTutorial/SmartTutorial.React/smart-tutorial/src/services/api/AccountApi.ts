import { IAccountEditInputs } from "../../components/Account/AccountProfileDetails";
import { IUpdatedUserInfo } from "../../auth/Auth";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";

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
