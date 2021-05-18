import { webAPIUrl } from "../../AppSettings";
import { axiosAuthorized } from "../axios/axios";
import {
  ITopicData,
  ITopicInputData,
  ITopicTableData,
} from "./models/ITopicData";
import { IServerCreateTopicError } from "./models/errors/topics/ITopicsErrors";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "./models/pagination/IPagination";

export async function getTopicsPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<ITopicTableData>> {
  let result: IPaginatedResult<ITopicTableData> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<ITopicData>>(
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
      response.data.items.forEach((element: ITopicData) =>
        result.items.push(mapTopicFromServer(element))
      );
    })
    .catch((err) => console.log(err.response));
  return result;
}

export const mapTopicFromServer = (topic: ITopicData): ITopicTableData => ({
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
  data: ITopicInputData,
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
