import {webAPIUrl} from "../../AppSettings";
import axios from "axios";
import {axiosAuthorized} from "../axios/axios";
import {ICourseData, ICourseDataWithSubjects, ICourseInputData} from "./models/ICourseData";
import {IServerCreateCourseError} from "./models/errors/ICourseErrors";
import {IPaginatedRequest, IPaginatedResult} from "./models/pagination/IPagination";

export async function getCourses(): Promise<ICourseData[]> {
  let data: ICourseData[] = [];
  await axios
    .get<ICourseData[]>(webAPIUrl + "/courses", {
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

export async function getCourseWithSubjects(
  id: number
): Promise<ICourseDataWithSubjects | null> {
  let data: ICourseDataWithSubjects | null = null;
  await axios
    .get<ICourseDataWithSubjects>(webAPIUrl + "/courses/" + id.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      data = response.data;
    });
  return data;
}

export async function createNewCourse(
  data: ICourseInputData,
  token: string
): Promise<IServerCreateCourseError | null> {
  let error: IServerCreateCourseError = {
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
      error.message = err.response.data;
    });
  if (error.message) {
    return error;
  }
  return null;
}

export async function getCoursesPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<ICourseData>> {
  let result: IPaginatedResult<ICourseData> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<ICourseData>>(
      `${webAPIUrl}/courses/getPaginated`,
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

export async function deleteCourse(id: number, token: string): Promise<boolean> {
  let result: boolean = false;
  await axiosAuthorized
    .delete(`${webAPIUrl}/courses/${id}`, {
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
