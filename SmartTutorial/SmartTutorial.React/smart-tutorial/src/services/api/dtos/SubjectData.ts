import { IThemeData } from "./ThemeData";
import { ITopicData } from "./TopicData";

export interface ISubjectData {
  name: string;
  complexity: number;
  id: number;
  date: Date;
  theme:IThemeData;
}

export interface ISubjectTableData{
  name:string;
  complexity:number;
  id:number;
  date:Date;
  theme:string;
}

export interface ISubjectDataWithTopics {
  name: string;
  complexity: number;
  id: number;
  topics: ITopicData[];
  theme: IThemeData;
}
