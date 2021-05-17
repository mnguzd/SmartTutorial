export interface IServerCreateSubjectError {
    name: "name" | "complexity" | "themeId";
    type: string;
    message: string;
}