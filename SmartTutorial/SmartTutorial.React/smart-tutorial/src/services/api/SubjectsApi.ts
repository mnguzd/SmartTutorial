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
interface IFilter {
  path: string;
  value: string;
  operation: string;
}
interface IRequestFilter {
  logicalOperator: 0 | 1;
  filters: IFilter[];
}
export interface IPaginatedRequest {
  pageIndex: number;
  pageSize: number;
  columnNameForSorting?: string;
  sortDirection?: "Asc" | "Desc";
  requestFilters?: IRequestFilter;
}
export interface IPaginatedResult<TEntity> {
  pageIndex: number;
  pageSize: number;
  total: number;
  items: TEntity[];
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
