import AdminPage from "./AdminPage";
import { useEffect, useState } from "react";
import CustomLoadingOverlay from "../components/CustomLoadingOverlay";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { ISubjectTableData } from "../services/api/dtos/SubjectData";
import { getSubjectsPaginated, ISubjectTableDataWithTotalCount } from "../services/api/SubjectsApi";
import { useAuth } from "../auth/Auth";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 500,
    width: "100%",
    marginTop: theme.spacing(9),
  },
}));

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<ISubjectTableData[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalCount,setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const { accessToken } = useAuth();

  const classes = useStyles();

  var columns: GridColDef[] = [
    {
      headerName: "Id",
      headerAlign: "center",
      field: "id",
      type: "number",
      flex: 0.1,
    },
    {
      headerName: "Name",
      headerAlign: "center",
      field: "name",
      flex: 0.15,
    },
    {
      headerName: "Complexity",
      headerAlign: "center",
      field: "complexity",
      type: "number",
      flex: 0.15,
    },
    {
      headerName: "Created",
      headerAlign: "center",
      field: "date",
      type: "date",
      flex: 0.2,
    },
    {
      headerName: "Theme",
      headerAlign: "center",
      field: "theme",
      flex: 0.3,
    },
  ];
 
  useEffect(() => {
    async function GetSubjects(): Promise<void> {
      setLoading(true);
      const result: ISubjectTableDataWithTotalCount = await getSubjectsPaginated(
        pageNumber+1,
        pageSize,
        accessToken
      );
      setSubjects(result.data);
      setTotalCount(result.totalCount);
      setLoading(false);
    }
    GetSubjects();
  }, [accessToken, pageNumber, pageSize]);
  return (
    <AdminPage title="Admin | Subjects">
      <div className={classes.root}>
        <DataGrid
          rowHeight={40}
          columns={columns}
          rows={subjects}
          autoHeight
          pagination
          components={{
            LoadingOverlay: CustomLoadingOverlay,
          }}
          paginationMode="server"
          rowCount={totalCount}
          pageSize={pageSize}
          page={pageNumber}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={(params) => {
            setPageNumber(params.page);
          }}
          onPageSizeChange={(params) => {
            setPageSize(params.pageSize);
          }}
          loading={loading}
        />
      </div>
    </AdminPage>
  );
}
