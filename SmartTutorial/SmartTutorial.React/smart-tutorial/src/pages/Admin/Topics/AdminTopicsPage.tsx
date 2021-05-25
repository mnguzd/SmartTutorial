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
import { useAuth } from "../../../auth/Auth";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "../../../services/api/models/pagination/IPagination";
import { ITopicTableData } from "../../../services/api/models/ITopicData";
import { CreateTopicForm } from "./CreateTopicForm";
import {
  deleteTopic,
  getTopicsPaginated,
} from "../../../services/api/TopicsApi";

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

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<ITopicTableData[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);

  const [loading, setLoading] = useState<boolean>(true);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  const { accessToken } = useAuth();

  const classes = useStyles();

  const onFilterChange = useCallback((params: GridFilterModelParams) => {
    setFilterModel(params.filterModel);
  }, []);

  const handleSortModelChange = useCallback((params: GridSortModelParams) => {
    setSortModel(params.sortModel);
  }, []);

  const callBackTopics = useCallback(
    async function GetTopics(): Promise<void> {
      setLoading(true);
      const request: IPaginatedRequest = {
        pageIndex: pageNumber,
        pageSize: pageSize,
      };
      if (sortModel && sortModel[0]) {
        request.sortDirection = sortModel[0].sort === "asc" ? "Asc" : "Desc";
        request.columnNameForSorting =
          sortModel[0].field === "subject"
            ? "subject.name"
            : sortModel[0].field;
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
                filterModel.items[0].columnField === "subject"
                  ? "subject.name"
                  : filterModel.items[0].columnField,
              value: filterModel.items[0].value,
              operation: filterModel.items[0].operatorValue,
            },
          ],
        };
      }
      const result: IPaginatedResult<ITopicTableData> =
        await getTopicsPaginated(request, accessToken);
      setTotalCount(result.total);
      setTopics(result.items);
      setLoading(false);
    },
    [pageNumber, pageSize, sortModel, filterModel, accessToken]
  );
  async function deleteAndUpdateTopic(id: GridRowId, token: string) {
    const success = await deleteTopic(Number(id), token);
    if (success) {
      setTotalCount((x) => x - 1);
    }
  }
  async function onDeleteSubmit() {
    selectionModel.map((val) => deleteAndUpdateTopic(val, accessToken));
    setSelectionModel([]);
    await callBackTopics();
  }
  useEffect(() => {
    callBackTopics();
  }, [callBackTopics]);
  return (
    <AdminPage title="Admin | Topics">
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
          rows={topics}
          autoHeight
          pagination
          checkboxSelection
          showCellRightBorder
          columnBuffer={5}
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
        <CreateTopicForm
          accessToken={accessToken}
          callBack={callBackTopics}
          loading={loading}
        />
      </div>
    </AdminPage>
  );
}
const columns: GridColDef[] = [
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
    headerName: "Order",
    headerAlign: "center",
    field: "order",
    width: 100,
  },
  {
    headerName: "Subject",
    headerAlign: "center",
    field: "subject",
    width: 100,
  },
  {
    headerName: "Content",
    headerAlign: "center",
    field: "content",
    flex: 1,
  },
];
