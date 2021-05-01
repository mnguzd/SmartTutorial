import {ISubjectDataWithTopics} from "./../../data/SubjectData";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";

export async function getSubjectWithTopics(
    id: number
  ): Promise<ISubjectDataWithTopics | null> {
    let data: ISubjectDataWithTopics | null = null;
    await axios
      .get<ISubjectDataWithTopics>(webAPIUrl + "/subjects/" + id.toString(), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        data = response.data;
      });
    console.log(data);
    return data;
  }