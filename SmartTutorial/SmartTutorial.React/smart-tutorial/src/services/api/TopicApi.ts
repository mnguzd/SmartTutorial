import { webAPIUrl } from "../../AppSettings";
import { axiosAuthorized } from "../axios/axios";
import {
  ITopic,
  ITopicInput,
  ITopicName,
  ITopicTable,
} from "./models/ITopic";
import { IServerCreateTopicError } from "./models/errors/ITopicErrors";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "./models/pagination/IPagination";
import axios from "axios";

export async function getTopic(id: number): Promise<ITopic | null> {
  let data: ITopic | null = null;
  await axios
    .get<ITopic>(`${webAPIUrl}/topics/${id}`, {
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
export async function getLightTopics(token: string): Promise<ITopicName[]> {
  let data: ITopicName[] = [];
  await axios
    .get<ITopicName[]>(`${webAPIUrl}/topics/lightTopics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}

export async function getTopicsPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<ITopicTable>> {
  let result: IPaginatedResult<ITopicTable> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<ITopic>>(
      `${webAPIUrl}/topics/getPaginated`,
      request,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      result.pageIndex = response.data.pageIndex;
      result.pageSize = response.data.pageSize;
      result.total = response.data.total;
      response.data.items.forEach((element: ITopic) =>
        result.items.push(mapTopicFromServer(element))
      );
    })
    .catch((err) => console.log(err.response));
  return result;
}

export const mapTopicFromServer = (topic: ITopic): ITopicTable => ({
  ...topic,
  subject: topic.subject.name,
});

export async function deleteTopic(id: number, token: string): Promise<boolean> {
  let result: boolean = false;
  await axiosAuthorized
    .delete(`${webAPIUrl}/topics/${id}`, {
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

export async function createNewTopic(
  data: ITopicInput,
  token: string
): Promise<IServerCreateTopicError | null> {
  let error: IServerCreateTopicError = {
    name: "name",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .post(`${webAPIUrl}/topics`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      console.log(err.response.data);
      error.message = err.response.data;
    });
  if (error.message) {
    return error;
  }
  return null;
}
