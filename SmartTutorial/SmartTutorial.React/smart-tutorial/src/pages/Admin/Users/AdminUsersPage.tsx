import AdminPage from "../AdminPage";
import { useCallback, useEffect, useState } from "react";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import {
  DataGrid,
  GridCellParams,
  GridCellValue,
  GridColDef,
  GridEditCellPropsParams,
  GridEditRowsModel,
  GridFilterModel,
  GridFilterModelParams,
  GridRowId,
  GridSortModel,
  GridSortModelParams,
  GridToolbar,
} from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { getUsersPaginated, deleteUser } from "../../../services/api/UserApi";
import { useAuth } from "../../../auth/Auth";
import { Grid } from "@material-ui/core";
import { Button, Avatar } from "@material-ui/core";
import { DialogForm } from "../../../components/DialogForm/DialogForm";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "../../../services/api/models/pagination/IPagination";
import { IUserTableData } from "../../../services/api/models/user/IUserData";
import { CreateUserForm } from "./CreateUserForm";

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

function validateEmail(email: GridCellValue) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUserTableData[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({});
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  const { accessToken } = useAuth();

  const classes = useStyles();

  const handleEditCellChange = useCallback(
    ({ id, field, props }: GridEditCellPropsParams) => {
      if (field === "email") {
        const data = props; // Fix eslint value is missing in prop-types for JS files
        const isValid = validateEmail(data.value);
        const newState: GridEditRowsModel = {};
        newState[id] = {
          ...editRowsModel[id],
          email: { ...props, error: !isValid },
        };
        setEditRowsModel((state) => ({ ...state, ...newState }));
      }
    },
    [editRowsModel]
  );

  const onFilterChange = useCallback((params: GridFilterModelParams) => {
    setFilterModel(params.filterModel);
  }, []);

  const handleSortModelChange = useCallback((params: GridSortModelParams) => {
    setSortModel(params.sortModel);
  }, []);

  const callBackUsers = useCallback(
    async function GetUsers(): Promise<void> {
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
      const result: IPaginatedResult<IUserTableData> = await getUsersPaginated(
        request,
        accessToken
      );
      setUsers(result.items);
      setTotalCount(result.total);
      setLoading(false);
    },
    [accessToken, pageNumber, pageSize, sortModel, filterModel]
  );
  async function deleteAndUpdateUser(id: GridRowId, token: string) {
    const success = await deleteUser(Number(id), token);
    if (success) {
      setTotalCount((x) => x - 1);
    }
  }
  async function onDeleteSubmit() {
    selectionModel.map((val) => deleteAndUpdateUser(val, accessToken));
    setSelectionModel([]);
    await callBackUsers();
  }
  useEffect(() => {
    callBackUsers();
  }, [callBackUsers]);
  return (
    <AdminPage title="Admin | Users">
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
          rows={users}
          autoHeight
          pagination
          checkboxSelection
          editRowsModel={editRowsModel}
          onEditCellChange={handleEditCellChange}
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
        <CreateUserForm
          accessToken={accessToken}
          setOpenPopup={setOpenPopup}
          loading={loading}
          callBack={callBackUsers}
        />
      </DialogForm>
      <Button onClick={() => setOpenPopup(true)} />
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
    headerName: "Username",
    headerAlign: "center",
    field: "userName",
    width: 150,
  },
  {
    headerName: "Email",
    headerAlign: "center",
    field: "email",
    width: 150,
    editable: true,
  },
  {
    headerName: "Avatar",
    headerAlign: "center",
    align: "center",
    field: "avatarPath",
    sortable: false,
    filterable: false,
    width: 100,
    renderCell: (params: GridCellParams) => (
      <Avatar src={params.value?.toString()} variant="square" />
    ),
  },
  {
    headerName: "Rating",
    headerAlign: "center",
    type: "number",
    field: "rating",
    width: 150,
  },
  {
    headerName: "First name",
    headerAlign: "center",
    field: "firstName",
    width: 150,
  },
  {
    headerName: "Last name",
    headerAlign: "center",
    field: "lastName",
    width: 150,
  },
  {
    headerName: "Role",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    field: "role",
    width: 100,
  },
  {
    headerName: "Country",
    headerAlign: "center",
    field: "country",
    width: 150,
  },
];
