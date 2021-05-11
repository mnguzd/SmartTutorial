import AdminPage from "../AdminPage";
import { Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { getThemes } from "../../../services/api/ThemesApi";
import { IThemeData } from "../../../services/api/dtos/ThemeData";
import { DataGrid, GridCellParams, GridColDef } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 500,
    width: "100%",
    marginTop: theme.spacing(9),
  },
}));

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<IThemeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const classes = useStyles();

  var columns: GridColDef[] = [
    { headerName: "Id", headerAlign: "center", field: "id", flex: 0.1 },
    { headerName: "Name", headerAlign: "center", field: "name", flex: 0.15 },
    {
      headerName: "Image",
      headerAlign: "center",
      field: "imageUrl",
      flex: 0.1,
      renderCell: (params: GridCellParams) => (
        <Avatar src={params.value?.toString()} variant="square" />
      ),
    },
    {
      headerName: "Description",
      headerAlign: "center",
      field: "description",
      flex: 0.6,
    },
  ];

  useEffect(() => {
    async function GetThemes(): Promise<void> {
      setLoading(true);
      const result: IThemeData[] = await getThemes();
      setThemes(result);
      setLoading(false);
    }
    GetThemes();
  }, []);
  return (
    <AdminPage title="Admin | Themes">
      <div className={classes.root}>
        <DataGrid
          rowHeight={40}
          columns={columns}
          rows={themes}
          autoHeight
          loading={loading}
        />
      </div>
    </AdminPage>
  );
}
