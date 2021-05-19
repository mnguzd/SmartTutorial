export interface IServerCreateTopicError {
  name: "name" | "content" | "order" | "subjectId";
  type: string;
  message: string;
}
