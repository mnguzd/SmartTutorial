import {
  IQuestionWithAnswers,
  IAnswerTheQuestion,
  IQuestionTableData,
  IQuestionFlattenedTableData,
  IAddQuestion,
} from "./models/IQuestionData";
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
): Promise<IQuestionWithAnswers[]> {
  let data: IQuestionWithAnswers[] = [];
  await axiosAuthorized
    .get<IQuestionWithAnswers[]>(
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

export async function getGuestQuestionsByTopicId(
  topicId: number
): Promise<IQuestionWithAnswers[]> {
  let data: IQuestionWithAnswers[] = [];
  await axios
    .get<IQuestionWithAnswers[]>(
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
): Promise<IPaginatedResult<IQuestionFlattenedTableData>> {
  let result: IPaginatedResult<IQuestionFlattenedTableData> = {
    pageIndex: 0,
    pageSize: 0,
    total: 0,
    items: [],
  };
  await axiosAuthorized
    .post<IPaginatedResult<IQuestionTableData>>(
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
      response.data.items.forEach((element: IQuestionTableData) =>
        result.items.push(mapQuestionsFromServer(element))
      );
    })
    .catch((err) => console.log(err.response));
  return result;
}
export const mapQuestionsFromServer = (
  question: IQuestionTableData
): IQuestionFlattenedTableData => ({
  ...question,
  topic: question.topic.name,
  option1: question.answers[0].text,
  option2: question.answers[1].text,
  option3: question.answers[2].text,
  option4: question.answers[3].text,
});
