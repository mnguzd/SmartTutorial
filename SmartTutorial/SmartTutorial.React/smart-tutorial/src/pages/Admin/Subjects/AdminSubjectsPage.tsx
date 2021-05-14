import AdminPage from "../AdminPage";
import { useCallback, useEffect, useState } from "react";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import {
  DataGrid,
  GridColDef,
  GridFilterModelParams,
  GridRowId,
  GridToolbar,
} from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { ISubjectTableData } from "../../../services/api/dtos/SubjectData";
import {
  deleteSubject,
  getSubjectsPaginated,
  ISubjectTableDataWithTotalCount,
} from "../../../services/api/SubjectsApi";
import { useAuth } from "../../../auth/Auth";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { DialogForm } from "../../../components/DialogForm/DialogForm";
import DeleteIcon from "@material-ui/icons/Delete";
import { CreateSubjectForm } from "./CreateSubjectForm";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 500,
    width: "100%",
    marginTop: theme.spacing(7),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<ISubjectTableData[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterValue, setFilterValue] = useState<string | undefined>();

  const [loading, setLoading] = useState<boolean>(true);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  const { accessToken } = useAuth();

  const classes = useStyles();

  const onFilterChange = useCallback(
    (params: GridFilterModelParams) => {
      setFilterValue(params.filterModel.items[0].value);
      console.log(params.filterModel.items[0].operatorValue?.toString());
    },
    []
  );

  const callBackSubjects = useCallback(
    async function GetSubjects(): Promise<void> {
      setLoading(true);
      const result: ISubjectTableDataWithTotalCount =
        await getSubjectsPaginated(pageNumber + 1, pageSize, accessToken);
      setSubjects(result.items);
      if (result.totalCount !== totalCount) {
        setTotalCount(result.totalCount);
      }
      setLoading(false);
    },
    [accessToken, pageNumber, pageSize, totalCount]
  );
  async function deleteAndUpdateSubject(id: GridRowId, token: string) {
    const success = await deleteSubject(Number(id), token);
    if (success) {
      setTotalCount((x) => x - 1);
    }
  }
  async function onDeleteSubmit() {
    selectionModel.map((val) => deleteAndUpdateSubject(val, accessToken));
    setSelectionModel([]);
    callBackSubjects();
  }
  useEffect(() => {
    callBackSubjects();
  }, [callBackSubjects]);
  return (
    <AdminPage title="Admin | Subjects">
      <div className={classes.root}>
        <Grid container direction="column" alignItems="flex-end">
          <Button
            color="secondary"
            disabled={!selectionModel.length}
            onClick={() => onDeleteSubmit()}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Grid>
        <DataGrid
          rowHeight={40}
          columns={columns}
          rows={subjects}
          autoHeight
          pagination
          checkboxSelection
          showCellRightBorder
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            Toolbar: GridToolbar,
          }}
          paginationMode="server"
          filterMode="server"
          onFilterModelChange={onFilterChange}
          rowCount={totalCount}
          pageSize={pageSize}
          page={pageNumber}
          rowsPerPageOptions={[10, 15, 20, 30, 40]}
          onPageChange={(params) => {
            setPageNumber(params.page);
          }}
          onPageSizeChange={(params) => {
            setPageSize(params.pageSize);
          }}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection.selectionModel);
          }}
          selectionModel={selectionModel}
          loading={loading}
        />
        <Grid
          container
          direction="row"
          justify="flex-end"
          className={classes.button}
        >
          <Button
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={() => setOpenPopup(true)}
          >
            Add new
          </Button>
        </Grid>
      </div>
      <DialogForm openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <CreateSubjectForm
          accessToken={accessToken}
          setOpenPopup={setOpenPopup}
          loading={loading}
          callBack={callBackSubjects}
        />
      </DialogForm>
      <Button onClick={() => setOpenPopup(true)}></Button>
    </AdminPage>
  );
}
var columns: GridColDef[] = [
  {
    headerName: "Id",
    headerAlign: "center",
    field: "id",
    type: "number",
    width: 70,
  },
  {
    headerName: "Name",
    headerAlign: "center",
    field: "name",
    width: 150,
  },
  {
    headerName: "Complexity",
    headerAlign: "center",
    field: "complexity",
    type: "number",
    width: 150,
  },
  {
    headerName: "Created",
    headerAlign: "center",
    field: "date",
    type: "date",
    width: 130,
  },
  {
    headerName: "Theme",
    headerAlign: "center",
    field: "theme",
    flex: 1,
  },
];
