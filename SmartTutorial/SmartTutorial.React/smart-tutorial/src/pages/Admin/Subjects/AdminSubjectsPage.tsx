import AdminPage from "../AdminPage";
import { useCallback, useEffect, useState } from "react";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridFilterModelParams,
  GridRowId,
  GridSortModel,
  GridSortModelParams,
  GridToolbar,
} from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import {
  deleteSubject,
  getSubjectsPaginated,
} from "../../../services/api/SubjectApi";
import { useAuth } from "../../../auth/Auth";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { DialogForm } from "../../../components/DialogForm/DialogForm";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { CreateSubjectForm } from "./CreateSubjectForm";
import { EditSubjectForm } from "./EditSubjectForm";
import { ISubjectTable } from "../../../services/api/models/ISubject";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "../../../services/api/models/pagination/IPagination";

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
  const [subjects, setSubjects] = useState<ISubjectTable[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  const { accessToken } = useAuth();

  const classes = useStyles();

  const onFilterChange = useCallback((params: GridFilterModelParams) => {
    setFilterModel(params.filterModel);
  }, []);

  const handleSortModelChange = useCallback((params: GridSortModelParams) => {
    setSortModel(params.sortModel);
  }, []);

  const callBackSubjects = useCallback(
    async function GetSubjects(): Promise<void> {
      setLoading(true);
      const request: IPaginatedRequest = {
        pageIndex: pageNumber,
        pageSize: pageSize,
      };
      if (sortModel && sortModel[0]) {
        request.sortDirection = sortModel[0].sort === "asc" ? "Asc" : "Desc";
        request.columnNameForSorting =
          sortModel[0].field === "course" ? "course.name" : sortModel[0].field;
      }
      if (
        filterModel &&
        filterModel.items[0].value &&
        filterModel.items[0].operatorValue &&
        filterModel.items[0].columnField
      ) {
        request.requestFilters = {
          logicalOperator: 0,
          filters: [
            {
              path:
                filterModel.items[0].columnField === "course"
                  ? "course.name"
                  : filterModel.items[0].columnField,
              value: filterModel.items[0].value,
              operation: filterModel.items[0].operatorValue,
            },
          ],
        };
      }
      const result: IPaginatedResult<ISubjectTable> =
        await getSubjectsPaginated(request, accessToken);
      setTotalCount(result.total);
      setSubjects(result.items);
      setLoading(false);
    },
    [accessToken, pageNumber, pageSize, sortModel, filterModel]
  );
  async function deleteAndUpdateSubject(id: GridRowId, token: string) {
    const success = await deleteSubject(Number(id), token);
    if (success) {
      await callBackSubjects();
    }
  }
  async function onDeleteSubmit() {
    selectionModel.map((val) => deleteAndUpdateSubject(val, accessToken));
    setSelectionModel([]);
  }
  useEffect(() => {
    callBackSubjects();
  }, [callBackSubjects]);
  return (
    <AdminPage title="Admin | Subjects">
      <div className={classes.root}>
        <Grid container direction="row" alignItems="center" justify="flex-end">
          <Button
            color="primary"
            disabled={selectionModel.length !== 1}
            onClick={() => setOpenEditPopup(true)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
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
          sortingMode="server"
          columnBuffer={5}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
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
      <DialogForm openPopup={openEditPopup} setOpenPopup={setOpenEditPopup}>
        <EditSubjectForm
          subjectId={Number(selectionModel[0])}
          accessToken={accessToken}
          setOpenPopup={setOpenEditPopup}
          loading={loading}
          callBack={callBackSubjects}
        />
      </DialogForm>
    </AdminPage>
  );
}

const columns: GridColDef[] = [
  {
    headerName: "Id",
    headerAlign: "center",
    field: "id",
    type: "number",
    width: 100,
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
    headerName: "Course",
    headerAlign: "center",
    field: "course",
    width: 500,
  },
];
