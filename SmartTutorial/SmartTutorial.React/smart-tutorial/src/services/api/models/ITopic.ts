import { ISubject } from "./ISubject";

export interface ITopic {
  id: number;
  name: string;
  content: string;
  order: number;
  subject: ISubject;
}
export interface ITopicName {
  name:string;
  id:number;
}
export interface ITopicTable {
  id: number;
  name: string;
  content: string;
  order: number;
  subject: string;
}

export interface ITopicInput {
  name: string;
  order: number;
  content: string;
  subjectId: number;
}
