import { webAPIUrl } from "../../AppSettings";
import { axiosAuthorized } from "../axios/axios";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "./models/pagination/IPagination";
import { IAddToRole, IUserTableData } from "./models/user/IUserData";

export async function deleteUser(id: number, token: string): Promise<boolean> {
  let result: boolean = false;
  await axiosAuthorized
    .delete(`${webAPIUrl}/account/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      result = true;
    })
    .catch((err) => {
      console.log(err.response);
    });
  return result;
}

export async function getUsersPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<IUserTableData>> {
  let result: IPaginatedResult<IUserTableData> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<IUserTableData>>(
      `${webAPIUrl}/account/getPaginated`,
      request,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      result = response.data;
    })
    .catch((err) => console.log(err.response));
  return result;
}

export async function addToRole(
  data: IAddToRole,
  token: string
): Promise<void> {
  await axiosAuthorized
    .post(`${webAPIUrl}/account/addToRole`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}
