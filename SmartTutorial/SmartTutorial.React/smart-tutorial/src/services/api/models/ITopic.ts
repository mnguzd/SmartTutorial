import { ISubjectData } from "./ISubjectData";

export interface ITopicData {
  id: number;
  name: string;
  content: string;
  order: number;
  subject: ISubjectData;
}
export interface ITopicNameData{
  name:string;
  id:number;
}
export interface ITopicTableData {
  id: number;
  name: string;
  content: string;
  order: number;
  subject: string;
}

export interface ITopicInputData {
  name: string;
  order: number;
  content: string;
  subjectId: number;
}
