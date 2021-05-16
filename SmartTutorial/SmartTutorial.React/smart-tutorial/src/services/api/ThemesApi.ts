import { IThemeData, IThemeDataWithSubjects } from "./dtos/ThemeData";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";
import { axiosAuthorized } from "../axios/axios";
import { IPaginatedRequest, IPaginatedResult } from "./SubjectsApi";

export async function getThemes(): Promise<IThemeData[]> {
  let data: IThemeData[] = [];
  await axios
    .get<IThemeData[]>(webAPIUrl + "/themes", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      data = response.data;
      return data;
    });
  return data;
}

export async function getThemeWithSubjects(
  id: number
): Promise<IThemeDataWithSubjects | null> {
  let data: IThemeDataWithSubjects | null = null;
  await axios
    .get<IThemeDataWithSubjects>(webAPIUrl + "/themes/" + id.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      data = response.data;
    });
  return data;
}
interface IThemeInputData {
  name: string;
  description: string;
  imageUrl: string;
}
export interface IServerCreateThemeError {
  name: "name" | "description" | "imageUrl";
  type: string;
  message: string;
}

export async function createNewTheme(
  data: IThemeInputData,
  token: string
): Promise<IServerCreateThemeError | null> {
  let error: IServerCreateThemeError = {
    name: "imageUrl",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .post(`${webAPIUrl}/themes`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      const dataError = err.response.data;
      error.message = dataError;
    });
  if (error.message) {
    return error;
  }
  return null;
}

export async function getThemesPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<IThemeData>> {
  let result: IPaginatedResult<IThemeData> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<IThemeData>>(
      `${webAPIUrl}/themes/getPaginated`,
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

export async function deleteTheme(id: number, token: string): Promise<boolean> {
  let result: boolean = false;
  await axiosAuthorized
    .delete(`${webAPIUrl}/themes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      result = true;
    })
    .catch((err) => {
      console.log(err.response);
    });
  return result;
}
