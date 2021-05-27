import { webAPIUrl } from "../../AppSettings";
import axios from "axios";
import { axiosAuthorized } from "../axios/axios";
import {
  ISubject,
  ISubjectWithTopics,
  ISubjectInput,
  ISubjectTable,
} from "./models/ISubject";
import { IServerCreateSubjectError } from "./models/errors/ISubjectErrors";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "./models/pagination/IPagination";

export async function getSubjectWithTopics(
  id: number
): Promise<ISubjectWithTopics | null> {
  let data: ISubjectWithTopics | null = null;
  await axios
    .get<ISubjectWithTopics>(`${webAPIUrl}/subjects/withTopics/${id}`, {
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

export async function getSubject(id: number): Promise<ISubject | null> {
  let data: ISubject | null = null;
  await axios
    .get<ISubject>(`${webAPIUrl}/subjects/${id}`)
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}

export async function getSubjects(): Promise<ISubject[]> {
  let data: ISubject[] = [];
  await axios
    .get<ISubject[]>(`${webAPIUrl}/subjects`, {
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
  data: ISubjectInput,
  token: string
): Promise<IServerCreateSubjectError | null> {
  let error: IServerCreateSubjectError = {
    name: "courseId",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .post(`${webAPIUrl}/subjects`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      error.message = err.response.data;
    });
  if (error.message) {
    return error;
  }
  return null;
}
export async function updateTheSubject(
  id: number,
  data: ISubjectInput,
  token: string
): Promise<IServerCreateSubjectError | null> {
  let error: IServerCreateSubjectError = {
    name: "courseId",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .put(`${webAPIUrl}/subjects/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
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
): Promise<IPaginatedResult<ISubjectTable>> {
  let result: IPaginatedResult<ISubjectTable> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<ISubject>>(
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
      response.data.items.forEach((element: ISubject) =>
        result.items.push(mapSubjectFromServer(element))
      );
    })
    .catch((err) => console.log(err.response));
  return result;
}
export const mapSubjectFromServer = (subject: ISubject): ISubjectTable => ({
  ...subject,
  date: new Date(subject.date),
  course: subject.course.name,
});
