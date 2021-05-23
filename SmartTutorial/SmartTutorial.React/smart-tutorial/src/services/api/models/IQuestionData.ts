import { IAnswer } from "./IAnswerData";
import { ITopicNameData } from "./ITopicData";

export interface IQuestion {
  text: string;
  id: number;
}
export interface IQuestionWithAnswers {
  text: string;
  id: number;
  alreadyAnswered: boolean;
  answers: IAnswer[];
}
export interface IQuestionTableData {
  text: string;
  answer: string;
  id: number;
  alreadyAnswered: boolean;
  topic: ITopicNameData;
  answers: IAnswer[];
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
