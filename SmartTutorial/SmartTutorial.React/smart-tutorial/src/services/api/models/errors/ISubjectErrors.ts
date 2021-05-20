export interface IServerCreateSubjectError {
    name: "name" | "complexity" | "courseId";
    type: string;
    message: string;
}