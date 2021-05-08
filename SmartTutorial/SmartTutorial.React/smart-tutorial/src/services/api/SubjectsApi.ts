import { ISubjectDataWithTopics } from "./dtos/SubjectData";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";

export async function getSubjectWithTopics(
  id: number
): Promise<ISubjectDataWithTopics | null> {
  let data: ISubjectDataWithTopics | null = null;
  await axios
    .get<ISubjectDataWithTopics>(
      `${webAPIUrl}/subjects/${id}?includeTopics=true`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err.response));
  return data;
}
