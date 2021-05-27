import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form/";
import { Editor } from "@tinymce/tinymce-react";
import { createNewTopic } from "../../../services/api/TopicApi";
import { FC, useCallback, useEffect, useState } from "react";
import { IServerCreateTopicError } from "../../../services/api/models/errors/ITopicErrors";
import { Button, TextField, FormHelperText, Grid } from "@material-ui/core";
import { getSubjects } from "../../../services/api/SubjectApi";
import { Autocomplete } from "@material-ui/lab";
import { ISubject } from "../../../services/api/models/ISubject";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(6),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  formValues: {
    marginTop: theme.spacing(2),
  },
}));

const schema = yup.object().shape({
  name: yup
    .string()
    .max(30, "Name is longer than 30 characters")
    .min(2, "Name is shorter than 2 characters")
    .required("Enter the name"),
  content: yup
    .string()
    .max(100000, "Content is more than 100000 characters")
    .min(20, "Content is less than 20 characters")
    .required("Provide any content"),
  order: yup
    .number()
    .positive("Order should be positive")
    .required("Enter the URL"),
  subjectId: yup
    .number()
    .positive("Id should be positive")
    .required("Enter subject Id"),
});

interface IFormInputs {
  name: string;
  content: string;
  order: number;
  subjectId: number;
}
interface Props {
  accessToken: string;
  loading: boolean;
  callBack: ICallback;
}
interface ICallback {
  (): void;
}
export const CreateTopicForm: FC<Props> = ({
  accessToken,
  callBack,
  loading,
}) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    setError,
    reset,
  } = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const classes = useStyles();

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);

  async function onSubmit(data: IFormInputs) {
    const result: IServerCreateTopicError | null = await createNewTopic(
      data,
      accessToken
    );
    if (result) {
      setError(result.name, { type: result.type, message: result.message });
    } else {
      reset();
      callBack();
    }
  }
  function updateSubjectId(newValue: ISubject | null): void {
    if (newValue) {
      setValue("subjectId", newValue.id);
    }
  }
  const setSubjectsAsync = useCallback(async function SetSubjects() {
    setSubjectsLoading(true);
    const result: ISubject[] = await getSubjects();
    setSubjects(result);
    setSubjectsLoading(false);
  }, []);
  useEffect(() => {
    setSubjectsAsync();
  }, [setSubjectsAsync]);
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <div>
        <Controller
          control={control}
          name="content"
          render={() => (
            <Editor
              apiKey="xbc0e10hc6qsmznr1r3ez6bnw3ozol916ykuebp3u5gqzggw"
              onEditorChange={(a) => setValue("content", a)}
              id="content"
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image",
                  "charmap print preview anchor help",
                  "searchreplace visualblocks code",
                  "insertdatetime media table paste wordcount",
                  "codesample",
                ],
                codesample_languages: [
                  { text: "HTML/XML", value: "markup" },
                  { text: "JavaScript", value: "javascript" },
                  { text: "CSS", value: "css" },
                  { text: "PHP", value: "php" },
                  { text: "Ruby", value: "ruby" },
                  { text: "Python", value: "python" },
                  { text: "Java", value: "java" },
                  { text: "C", value: "c" },
                  { text: "C#", value: "csharp" },
                  { text: "C++", value: "cpp" },
                ],
                toolbar:
                  "undo redo | bold italic underline strikethrough codesample | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link codesample | ltr rtl",
              }}
            />
          )}
        />
        <FormHelperText error={!!errors.content}>
          {errors && errors.content && errors?.content.message}
        </FormHelperText>
        <Grid
          container
          direction="column"
          justify="flex-start"
          spacing={3}
          className={classes.formValues}
        >
          <Grid item md={4}>
            <Controller
              control={control}
              name="name"
              render={() => (
                <TextField
                  autoFocus
                  variant="outlined"
                  id="name"
                  fullWidth
                  label="Name"
                  {...register("name", { required: true })}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  onChange={(e) => setValue("name", e.target.value)}
                />
              )}
            />
          </Grid>
          <Grid item md={4}>
            <Controller
              control={control}
              name="order"
              render={() => (
                <TextField
                  variant="outlined"
                  id="order"
                  fullWidth
                  label="Order (number)"
                  {...register("order", { required: true })}
                  error={!!errors.order}
                  helperText={errors?.order?.message}
                  onChange={(e) => setValue("order", Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid item md={4}>
            <Controller
              control={control}
              name="subjectId"
              render={() => (
                <Autocomplete
                  id="subjectsAutocomplete"
                  options={subjects}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  loading={subjectsLoading}
                  onChange={(_e, newValue: null | ISubject) =>
                    updateSubjectId(newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      id="subjectId"
                      fullWidth
                      label="Subject"
                      {...register("subjectId", { required: true })}
                      error={!!errors.subjectId}
                      helperText={errors?.subjectId?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={loading}
          className={classes.button}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
