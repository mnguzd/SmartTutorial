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
    .get<ISubjectDataWithTopics>(
      `${webAPIUrl}/subjects/${id}?includeTopics=true`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}

export interface ISubjectTableDataWithTotalCount {
  data: ISubjectTableData[];
  totalCount: number;
}

export async function getSubjectsPaginated(
  pageNumber: number,
  pageSize: number,
  token: string
): Promise<ISubjectTableDataWithTotalCount> {
  let subjects: ISubjectTableData[] = [];
  let count: number = 0;
  await axiosAuthorized
    .get<ISubjectData[]>(
      `${webAPIUrl}/subjects/getPaginated?PageNumber=${pageNumber}&PageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      count = Number(response.headers["x-pagination"]);
      return response.data.forEach((element: ISubjectData) =>
        subjects.push(mapSubjectFromServer(element))
      );
    })
    .catch((err) => console.log(err.response));
  return { data: subjects, totalCount: count };
}
export const mapSubjectFromServer = (
  subject: ISubjectData
): ISubjectTableData => ({
  ...subject,
  date: new Date(subject.date),
  theme: subject.theme.name,
});
