import {IThemeData} from "./IThemeData";
import {ITopicData} from "./ITopicData";


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

export interface ISubjectInputData {
    name: string;
    complexity: number;
    themeId: number;
}