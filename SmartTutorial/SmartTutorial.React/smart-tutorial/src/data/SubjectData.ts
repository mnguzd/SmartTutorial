import {ITopicData} from "./TopicData";

export interface ISubjectData {
  name: string;
  complexity: number;
  id: number;
  date: string;
}
export interface ISubjectDataWithTopics{
  name:string;
  complexity:number;
  id:number;
  themeId:number;
  topics:ITopicData[];
}