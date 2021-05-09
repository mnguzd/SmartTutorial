import AdminPage from "./AdminPage";
import { Grid, Typography, Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { getThemes } from "../services/api/ThemesApi";
import { IThemeData } from "../services/api/dtos/ThemeData";
import MaterialTable from "material-table";

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<IThemeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  var columns = [
    { title: "id", field: "id" },
    { title: "Name", field: "name" },
    { title: "ImageUrl", filed: "imageUrl", hidden: true },
    { title: "Image", render: (rowData: { imageUrl: string | undefined; }) => <Avatar src={rowData.imageUrl} /> },
    { title: "Description", field: "description" },
  ];
  useEffect(() => {
    async function GetThemes(): Promise<void> {
      const result: IThemeData[] = await getThemes();
      setThemes(result);
    }
    setLoading(true);
    GetThemes();
    setLoading(false);
  }, []);
  return (
    <AdminPage title="Admin | Themes">
      <Grid
        container
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <MaterialTable
            title="WebTutor | Themes"
            columns={columns}
            data={themes}
          />
        </Grid>
      </Grid>
    </AdminPage>
  );
}
