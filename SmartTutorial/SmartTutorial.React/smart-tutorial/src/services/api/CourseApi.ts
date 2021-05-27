import { webAPIUrl } from "../../AppSettings";
import axios from "axios";
import { axiosAuthorized } from "../axios/axios";
import {
  ICourse,
  ICourseWithSubjects,
  ICourseInput,
} from "./models/ICourse";
import { IServerCreateCourseError } from "./models/errors/ICourseErrors";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "./models/pagination/IPagination";

export async function getCourses(): Promise<ICourse[]> {
  let data: ICourse[] = [];
  await axios
    .get<ICourse[]>(webAPIUrl + "/courses", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      data = response.data;
    });
  return data;
}

export async function getCourseWithSubjects(
  id: number
): Promise<ICourseWithSubjects | null> {
  let data: ICourseWithSubjects | null = null;
  await axios
    .get<ICourseWithSubjects>(webAPIUrl + "/courses/" + id.toString(), {
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
  data: ICourseInput,
  token: string
): Promise<IServerCreateCourseError | null> {
  let error: IServerCreateCourseError = {
    name: "imageUrl",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .post(`${webAPIUrl}/courses`, data, {
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

export async function editTheCourse(
  id: number,
  data: ICourseInput,
  token: string
): Promise<IServerCreateCourseError | null> {
  let error: IServerCreateCourseError = {
    name: "imageUrl",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .put(`${webAPIUrl}/courses/${id}`, data, {
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

export async function getCoursesPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<ICourse>> {
  let result: IPaginatedResult<ICourse> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<ICourse>>(
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

export async function deleteCourse(
  id: number,
  token: string
): Promise<boolean> {
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
