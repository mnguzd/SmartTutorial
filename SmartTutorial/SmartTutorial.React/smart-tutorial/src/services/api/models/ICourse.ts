import {ISubject} from "./ISubject";

export interface ICourse {
    name: string;
    id: number;
    imageUrl: string;
    description: string;
}
export interface ICourseWithSubjects {
    name: string;
    id: number;
    description: string;
    subjects: ISubject[];
}
export interface ICourseInput {
    name: string;
    description: string;
    imageUrl: string;
}
