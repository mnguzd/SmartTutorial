export interface IServerCreateQuestionError {
  name:
    | "text"
    | "answer"
    | "topicId"
    | "option1"
    | "option2"
    | "option3"
    | "option4";
  type: string;
  message: string;
}
