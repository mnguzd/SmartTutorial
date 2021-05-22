import {
  IQuestionWithAnswers,
  IAnswerTheQuestion,
} from "./models/IQuestionData";
import { webAPIUrl } from "../../AppSettings";
import { axiosAuthorized } from "../axios/axios";

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
