import {ISubjectData} from "./ISubjectData";

export interface ICourseData {
    name: string;
    id: number;
    imageUrl: string;
    description: string;
}
export interface ICourseDataWithSubjects {
    name: string;
    id: number;
    description: string;
    subjects: ISubjectData[];
}
export interface ICourseInputData {
    name: string;
    description: string;
    imageUrl: string;
}
