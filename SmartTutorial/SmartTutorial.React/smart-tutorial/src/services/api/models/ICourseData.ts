import {ISubjectData} from "./ISubjectData";

export interface IThemeData {
    name: string;
    id: number;
    imageUrl: string;
    description: string;
}
export interface IThemeDataWithSubjects {
    name: string;
    id: number;
    description: string;
    subjects: ISubjectData[];
}
export interface IThemeInputData {
    name: string;
    description: string;
    imageUrl: string;
}
