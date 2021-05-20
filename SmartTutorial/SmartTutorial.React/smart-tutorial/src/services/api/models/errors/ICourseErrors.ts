export interface IServerCreateCourseError {
    name: "name" | "description" | "imageUrl";
    type: string;
    message: string;
}