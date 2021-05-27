import {ICourse} from "./ICourse";
import {ITopic} from "./ITopic";


export interface ISubject {
    name: string;
    complexity: number;
    id: number;
    date: Date;
    course:ICourse;
}

export interface ISubjectTable {
    name:string;
    complexity:number;
    id:number;
    date:Date;
    course:string;
}

export interface ISubjectWithTopics {
    name: string;
    complexity: number;
    id: number;
    topics: ITopic[];
    course: ICourse;
}

export interface ISubjectInput {
    name: string;
    complexity: number;
    courseId: number;
}