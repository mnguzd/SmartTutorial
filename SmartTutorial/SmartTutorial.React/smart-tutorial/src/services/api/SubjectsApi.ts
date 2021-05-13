import {
  ISubjectData,
  ISubjectDataWithTopics,
  ISubjectTableData,
} from "./dtos/SubjectData";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";
import { axiosAuthorized } from "../axios/axios";

export async function getSubjectWithTopics(
  id: number
): Promise<ISubjectDataWithTopics | null> {
  let data: ISubjectDataWithTopics | null = null;
  await axios
    .get<ISubjectDataWithTopics>(`${webAPIUrl}/subjects/withTopics/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}

interface ISubjectInputData {
  name: string;
  complexity: number;
  themeId: number;
}

export interface IServerCreateSubjectError {
  name: "name" | "complexity" | "themeId";
  type: string;
  message: string;
}

export async function createNewSubject(
  data: ISubjectInputData,
  token: string
): Promise<IServerCreateSubjectError | null> {
  let error: IServerCreateSubjectError = {
    name: "themeId",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .post(`${webAPIUrl}/subjects`, data, {
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

export async function deleteSubject(
  id: number,
  token: string
): Promise<boolean> {
  let result: boolean = false;
  await axiosAuthorized
    .delete(`${webAPIUrl}/subjects/${id}`, {
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

export interface ISubjectTableDataWithTotalCount {
  items: ISubjectTableData[];
  totalCount: number;
}

export interface ISubjectDataWithTotalCount {
  items: ISubjectData[];
  totalCount: number;
}


export async function getSubjectsPaginated(
  pageNumber: number,
  pageSize: number,
  token: string
): Promise<ISubjectTableDataWithTotalCount> {
  let result: ISubjectTableDataWithTotalCount = { items: [], totalCount: 0 };
  await axiosAuthorized
    .get<ISubjectDataWithTotalCount>(
      `${webAPIUrl}/subjects/getPaginated?PageNumber=${pageNumber}&PageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      result.totalCount = response.data.totalCount;
      response.data.items.forEach((element: ISubjectData) =>
        result.items.push(mapSubjectFromServer(element))
      );
    })
    .catch((err) => console.log(err.response));
  return result;
}
export const mapSubjectFromServer = (
  subject: ISubjectData
): ISubjectTableData => ({
  ...subject,
  date: new Date(subject.date),
  theme: subject.theme.name,
});
