import { IAnswer } from "./IAnswerData";

export interface IQuestion {
  text: string;
  answer: string;
  id: number;
}
export interface IQuestionWithAnswers {
  text: string;
  answer: string;
  id: number;
  alreadyAnswered:boolean;
  answers: IAnswer[];
}

export interface IAddQuestion {
  text: string;
  answer: string;
  topicId: number;
  answers: IAnswer[];
}

export interface IAnswerTheQuestion{
    id:number;
    userAnswer:string;
}
