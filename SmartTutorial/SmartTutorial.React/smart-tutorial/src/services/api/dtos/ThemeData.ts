import { ISubjectData } from "./SubjectData";

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
