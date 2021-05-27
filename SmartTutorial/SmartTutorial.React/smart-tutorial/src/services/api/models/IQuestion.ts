import { IOption } from "./IOption";
import { ITopicName } from "./ITopic";

export interface IQuestionWithOptions {
  text: string;
  id: number;
  alreadyAnswered: boolean;
  options: IOption[];
}
export interface IQuestionTable {
  text: string;
  answer: string;
  id: number;
  alreadyAnswered: boolean;
  topic: ITopicName;
  options: IOption[];
}
export interface IQuestionFlattenedTable {
  text: string;
  id: number;
  topic: string;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface IAddQuestion {
  text: string;
  answer: string;
  topicId: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface IAnswerTheQuestion {
  id: number;
  userAnswer: string;
}
