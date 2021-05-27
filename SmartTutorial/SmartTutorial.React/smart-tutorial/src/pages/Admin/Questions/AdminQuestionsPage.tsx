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
  deleteQuestion,
  getQuestion,
  getQuestionsPaginated,
} from "../../../services/api/QuestionApi";
import { useAuth } from "../../../auth/Auth";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { DialogForm } from "../../../components/DialogForm/DialogForm";
import { EditQuestionForm } from "./EditQuestionForm";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IQuestionFlattenedTable,
  IQuestionTable,
} from "../../../services/api/models/IQuestion";
import {
  IPaginatedRequest,
  IPaginatedResult,
} from "../../../services/api/models/pagination/IPagination";
import { CreateQuestionForm } from "./CreateQuestionForm";
import { getLightTopics } from "../../../services/api/TopicApi";
import { ITopicName } from "../../../services/api/models/ITopic";

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

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<IQuestionFlattenedTable[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [editingQuestion, setEditingQuestion] = useState<IQuestionTable>();
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [topics, setTopics] = useState<ITopicName[]>();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "id", sort: "asc" },
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);

  const { accessToken } = useAuth();

  const classes = useStyles();

  const onFilterChange = useCallback((params: GridFilterModelParams) => {
    setFilterModel(params.filterModel);
  }, []);

  const handleSortModelChange = useCallback((params: GridSortModelParams) => {
    setSortModel(params.sortModel);
  }, []);

  const callBackQuestions = useCallback(
    async function GetQuestions(): Promise<void> {
      setLoading(true);
      const request: IPaginatedRequest = {
        pageIndex: pageNumber,
        pageSize: pageSize,
      };
      if (sortModel && sortModel[0]) {
        request.sortDirection = sortModel[0].sort === "asc" ? "Asc" : "Desc";
        request.columnNameForSorting =
          sortModel[0].field === "topic" ? "topic.name" : sortModel[0].field;
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
                filterModel.items[0].columnField === "topic"
                  ? "topic.name"
                  : filterModel.items[0].columnField,
              value: filterModel.items[0].value,
              operation: filterModel.items[0].operatorValue,
            },
          ],
        };
      }
      const result: IPaginatedResult<IQuestionFlattenedTable> =
        await getQuestionsPaginated(request, accessToken);
      setQuestions(result.items);
      setTotalCount(result.total);
      setLoading(false);
    },
    [pageNumber, pageSize, sortModel, filterModel, accessToken]
  );
  async function deleteAndUpdateQuestion(id: GridRowId, token: string) {
    const success = await deleteQuestion(Number(id), token);
    if (success) {
      await callBackQuestions();
    }
  }
  async function handleOpenEdit() {
    const editQuestion = await getQuestion(
      Number(selectionModel[0]),
      accessToken
    );
    const result = await getLightTopics(accessToken);
    setTopics(result);
    if (editQuestion) {
      setEditingQuestion(editQuestion);
      setOpenEditPopup(true);
    }
  }
  async function handleOpenCreate() {
    const result = await getLightTopics(accessToken);
    setTopics(result);
    setOpenPopup(true);
  }
  async function onDeleteSubmit() {
    selectionModel.map((val) => deleteAndUpdateQuestion(val, accessToken));
    setSelectionModel([]);
  }
  useEffect(() => {
    callBackQuestions();
  }, [callBackQuestions]);
  return (
    <AdminPage title="Admin | Questions">
      <div className={classes.root}>
        <Grid container direction="row" alignItems="center" justify="flex-end">
          <Button
            color="primary"
            disabled={selectionModel.length !== 1}
            onClick={() => handleOpenEdit()}
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
          rows={questions}
          columnBuffer={8}
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
            onClick={() => handleOpenCreate()}
          >
            Add new
          </Button>
        </Grid>
      </div>
      {topics && (
        <DialogForm openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <CreateQuestionForm
            lightTopics={topics}
            accessToken={accessToken}
            setOpenPopup={setOpenPopup}
            loading={loading}
            callBack={callBackQuestions}
          />
        </DialogForm>
      )}
      {editingQuestion && topics && (
        <DialogForm openPopup={openEditPopup} setOpenPopup={setOpenEditPopup}>
          <EditQuestionForm
            question={editingQuestion}
            lightTopics={topics}
            accessToken={accessToken}
            setOpenPopup={setOpenEditPopup}
            loading={loading}
            callBack={callBackQuestions}
          />
        </DialogForm>
      )}
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
    headerName: "Question",
    headerAlign: "center",
    field: "text",
    width: 150,
  },
  {
    headerName: "Answer",
    headerAlign: "center",
    field: "answer",
    width: 150,
  },
  {
    headerName: "Topic",
    headerAlign: "center",
    field: "topic",
    width: 150,
  },
  {
    headerName: "Option 1",
    headerAlign: "center",
    field: "option1",
    width: 150,
    sortable: false,
    filterable: false,
  },
  {
    headerName: "Option 2",
    headerAlign: "center",
    field: "option2",
    width: 150,
    sortable: false,
    filterable: false,
  },
  {
    headerName: "Option 3",
    headerAlign: "center",
    field: "option3",
    width: 150,
    sortable: false,
    filterable: false,
  },
  {
    headerName: "Option 4",
    headerAlign: "center",
    field: "option4",
    width: 150,
    sortable: false,
    filterable: false,
  },
];
