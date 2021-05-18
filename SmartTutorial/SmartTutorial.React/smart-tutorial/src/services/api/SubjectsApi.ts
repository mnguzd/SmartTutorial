import { webAPIUrl } from "../../AppSettings";
import axios from "axios";
import { axiosAuthorized } from "../axios/axios";
import {
  ISubjectData,
  ISubjectDataWithTopics,
  ISubjectInputData,
  ISubjectTableData,
} from "./models/ISubjectData";
import { IServerCreateSubjectError } from "./models/errors/subjects/ISubjectErrors";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "./models/pagination/IPagination";

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

export async function getSubjects(): Promise<ISubjectData[]> {
  let data: ISubjectData[] = [];
  await axios
    .get<ISubjectData[]>(`${webAPIUrl}/subjects`, {
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
      error.message = err.response.data;
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
    .then(() => {
      result = true;
    })
    .catch((err) => {
      console.log(err.response);
    });
  return result;
}

export async function getSubjectsPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<ISubjectTableData>> {
  let result: IPaginatedResult<ISubjectTableData> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<ISubjectData>>(
      `${webAPIUrl}/subjects/getPaginated`,
      request,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      result.pageIndex = response.data.pageIndex;
      result.pageSize = response.data.pageSize;
      result.total = response.data.total;
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
