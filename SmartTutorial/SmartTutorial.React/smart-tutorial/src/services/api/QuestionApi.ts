import {
  IQuestionWithOptions,
  IAnswerTheQuestion,
  IQuestionTable,
  IQuestionFlattenedTable,
  IAddQuestion,
} from "./models/IQuestion";
import { webAPIUrl } from "../../AppSettings";
import { axiosAuthorized } from "../axios/axios";
import axios from "axios";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "./models/pagination/IPagination";
import { IServerCreateQuestionError } from "./models/errors/IQuestionErrors";

export async function getQuestionsByTopicId(
  topicId: number,
  token: string
): Promise<IQuestionWithOptions[]> {
  let data: IQuestionWithOptions[] = [];
  await axiosAuthorized
    .get<IQuestionWithOptions[]>(
      `${webAPIUrl}/questions/byTopicId/${topicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}
export async function getQuestion(
  id: number,
  token: string
): Promise<IQuestionTable | null> {
  let data: IQuestionTable | null = null;
  await axios
    .get<IQuestionTable>(`${webAPIUrl}/questions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}

export async function getGuestQuestionsByTopicId(
  topicId: number
): Promise<IQuestionWithOptions[]> {
  let data: IQuestionWithOptions[] = [];
  await axios
    .get<IQuestionWithOptions[]>(
      `${webAPIUrl}/questions/guest/byTopicId/${topicId}`
    )
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}

export async function answerTheQuestion(
  questionId: number,
  answer: string,
  token: string
): Promise<boolean> {
  let data: IAnswerTheQuestion = { id: questionId, userAnswer: answer };
  let result: boolean = false;
  await axiosAuthorized
    .post<boolean>(`${webAPIUrl}/questions/answer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      result = response.data;
    })
    .catch((err) => console.log(err.response));
  return result;
}

export async function createNewQuestion(
  data: IAddQuestion,
  token: string
): Promise<IServerCreateQuestionError | null> {
  let error: IServerCreateQuestionError = {
    name: "topicId",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .post(`${webAPIUrl}/questions`, data, {
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

export async function updateTheQuestion(
  questionId: number,
  data: IAddQuestion,
  token: string
): Promise<IServerCreateQuestionError | null> {
  let error: IServerCreateQuestionError = {
    name: "topicId",
    type: "server",
    message: "",
  };
  await axiosAuthorized
    .put(`${webAPIUrl}/questions/${questionId}`, data, {
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

export async function deleteQuestion(
  id: number,
  token: string
): Promise<boolean> {
  let result: boolean = false;
  await axiosAuthorized
    .delete(`${webAPIUrl}/questions/${id}`, {
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

export async function getQuestionsPaginated(
  request: IPaginatedRequest,
  token: string
): Promise<IPaginatedResult<IQuestionFlattenedTable>> {
  let result: IPaginatedResult<IQuestionFlattenedTable> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<IQuestionTable>>(
      `${webAPIUrl}/questions/getPaginated`,
      request,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      result.pageIndex = response.data.pageIndex;
      result.pageSize = response.data.pageSize;
      result.total = response.data.total;
      response.data.items.forEach((element: IQuestionTable) =>
        result.items.push(mapQuestionsFromServer(element))
      );
    })
    .catch((err) => console.log(err.response));
  return result;
}
export const mapQuestionsFromServer = (
  question: IQuestionTable
): IQuestionFlattenedTable => ({
  ...question,
  topic: question.topic.name,
  option1: question.options[0].text,
  option2: question.options[1].text,
  option3: question.options[2].text,
  option4: question.options[3].text,
});
