import { IOption } from "./IOptionData";
import { ITopicNameData } from "./ITopicData";

export interface IQuestionWithOptions {
  text: string;
  id: number;
  alreadyAnswered: boolean;
  options: IOption[];
}
export interface IQuestionTableData {
  text: string;
  answer: string;
  id: number;
  alreadyAnswered: boolean;
  topic: ITopicNameData;
  options: IOption[];
}
export interface IQuestionFlattenedTableData {
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
