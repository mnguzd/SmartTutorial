import { ISubjectData } from "./ISubjectData";

export interface ITopicData {
  id: string;
  name: string;
  content: string;
  order: number;
  subject: ISubjectData;
}
export interface ITopicTableData {
  id: string;
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
