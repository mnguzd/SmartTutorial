import {ICourseData} from "./ICourseData";
import {ITopicData} from "./ITopicData";


export interface ISubjectData {
    name: string;
    complexity: number;
    id: number;
    date: Date;
    course:ICourseData;
}

export interface ISubjectTableData{
    name:string;
    complexity:number;
    id:number;
    date:Date;
    course:string;
}

export interface ISubjectDataWithTopics {
    name: string;
    complexity: number;
    id: number;
    topics: ITopicData[];
    course: ICourseData;
}

export interface ISubjectInputData {
    name: string;
    complexity: number;
    courseId: number;
}