import { IThemeData } from "../../data/ThemeData";
import { IThemeDataWithSubjects } from "../../data/ThemeData";
import { webAPIUrl } from "../../AppSettings";
import axios from "axios";

export async function getThemes(): Promise<IThemeData[]> {
  let data: IThemeData[] = [];
  await axios
    .get<IThemeData[]>(webAPIUrl + "/themes", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      data = response.data;
      return data;
    });
  return data;
}

export async function getThemeWithSubjects(
  id: number
): Promise<IThemeDataWithSubjects | null> {
  let data: IThemeDataWithSubjects | null = null;
  await axios
    .get<IThemeDataWithSubjects>(webAPIUrl + "/themes/" + id.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      data = response.data;
    });
  return data;
}
