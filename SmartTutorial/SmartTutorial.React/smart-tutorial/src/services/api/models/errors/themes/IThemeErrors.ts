export interface IServerCreateThemeError {
    name: "name" | "description" | "imageUrl";
    type: string;
    message: string;
}