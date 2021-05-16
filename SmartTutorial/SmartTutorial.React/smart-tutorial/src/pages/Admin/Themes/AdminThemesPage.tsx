import AdminPage from "../AdminPage";
import { useCallback, useEffect, useState } from "react";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import {
  DataGrid,
  GridCellParams,
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
  IPaginatedResult,
  IPaginatedRequest,
} from "../../../services/api/SubjectsApi";
import {
  deleteTheme,
  getThemesPaginated,
} from "../../../services/api/ThemesApi";
import { useAuth } from "../../../auth/Auth";
import { Avatar, Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { DialogForm } from "../../../components/DialogForm/DialogForm";
import DeleteIcon from "@material-ui/icons/Delete";
import { CreateThemeForm } from "./CreateThemeForm";
import { IThemeData } from "../../../services/api/dtos/ThemeData";

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
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function AdminSubjectsPage() {
  const [themes, setThemes] = useState<IThemeData[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  const { accessToken } = useAuth();

  const classes = useStyles();

  const onFilterChange = useCallback((params: GridFilterModelParams) => {
    setFilterModel(params.filterModel);
  }, []);

  const handleSortModelChange = useCallback((params: GridSortModelParams) => {
    setSortModel(params.sortModel);
  }, []);

  const callBackThemes = useCallback(
    async function GetThemes(): Promise<void> {
      setLoading(true);
      const request: IPaginatedRequest = {
        pageIndex: pageNumber,
        pageSize: pageSize,
      };
      if (sortModel && sortModel[0]) {
        request.sortDirection = sortModel[0].sort === "asc" ? "Asc" : "Desc";
        request.columnNameForSorting = sortModel[0].field;
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
              path: filterModel.items[0].columnField,
              value: filterModel.items[0].value,
              operation: filterModel.items[0].operatorValue,
            },
          ],
        };
      }
      const result: IPaginatedResult<IThemeData> = await getThemesPaginated(
        request,
        accessToken
      );
      setThemes(result.items);
      if (result.total !== totalCount) {
        setTotalCount(result.total);
      }
      setLoading(false);
    },
    [accessToken, pageNumber, pageSize, totalCount, sortModel, filterModel]
  );
  async function deleteAndUpdateTheme(id: GridRowId, token: string) {
    const success = await deleteTheme(Number(id), token);
    if (success) {
      setTotalCount((x) => x - 1);
    }
  }
  async function onDeleteSubmit() {
    selectionModel.map((val) => deleteAndUpdateTheme(val, accessToken));
    setSelectionModel([]);
    callBackThemes();
  }
  useEffect(() => {
    callBackThemes();
  }, [callBackThemes]);
  return (
    <AdminPage title="Admin | Themes">
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
          rows={themes}
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
        <CreateThemeForm
          accessToken={accessToken}
          setOpenPopup={setOpenPopup}
          loading={loading}
          callBack={callBackThemes}
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
    align: "center",
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
    headerName: "Image",
    headerAlign: "center",
    align: "center",
    field: "imageUrl",
    sortable: false,
    filterable: false,
    width: 130,
    renderCell: (params: GridCellParams) => (
      <Avatar src={params.value?.toString()} variant="square" />
    ),
  },
  {
    headerName: "Description",
    headerAlign: "center",
    field: "description",
    flex: 1,
  },
];
