import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form/";
import { Editor } from "@tinymce/tinymce-react";
import { createNewTopic } from "../../../services/api/TopicsApi";
import React, { FC, useCallback, useEffect, useState } from "react";
import { IServerCreateTopicError } from "../../../services/api/models/errors/topics/ITopicsErrors";
import { Button, Divider, TextField, FormHelperText } from "@material-ui/core";
import { getSubjects } from "../../../services/api/SubjectsApi";
import { Autocomplete } from "@material-ui/lab";
import { ISubjectData } from "../../../services/api/models/ISubjectData";

const schema = yup.object().shape({
  name: yup
    .string()
    .max(20, "Name is longer than 100 characters")
    .min(2, "Name is shorter than 2 characters")
    .required("Enter the name"),
  content: yup
    .string()
    .max(100000, "Content is more than 100000 characters")
    .required("Enter the description"),
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
  } = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const [subjects, setSubjects] = useState<ISubjectData[]>([]);
  const [subjectId, setSubjectId] = useState<number>();
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);

  async function onSubmit(data: IFormInputs) {
    const result: IServerCreateTopicError | null = await createNewTopic(
      data,
      accessToken
    );
    if (result) {
      setError(result.name, { type: result.type, message: result.message });
    } else {
      callBack();
    }
  }
  function updateSubjectId(newValue: ISubjectData | null): void {
    if (newValue) {
      setValue("subjectId", newValue.id);
      setSubjectId(newValue.id);
    }
  }
  const setSubjectsAsync = useCallback(async function SetSubjects() {
    setSubjectsLoading(true);
    const result: ISubjectData[] = await getSubjects();
    setSubjects(result);
    setSubjectsLoading(false);
  }, []);
  useEffect(() => {
    setSubjectsAsync();
  });
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Controller
          control={control}
          name="name"
          render={() => (
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              id="name"
              label="Name"
              {...register("name", { required: true })}
              error={!!errors.name}
              helperText={errors?.name?.message}
              onChange={(e) => setValue("name", e.target.value)}
            />
          )}
        />
        <Controller
          control={control}
          name="order"
          render={() => (
            <TextField
              variant="outlined"
              fullWidth
              id="order"
              label="Order (number)"
              {...register("order", { required: true })}
              error={!!errors.order}
              helperText={errors?.order?.message}
              onChange={(e) => setValue("order", Number(e.target.value))}
            />
          )}
        />
        <Controller
          control={control}
          name="subjectId"
          render={() => (
            <Autocomplete
              id="subjectsAutocomplete"
              options={subjects}
              value={subjectId}
              getOptionLabel={(option) => option.name}
              loading={subjectsLoading}
              onChange={(_e, newValue: null | ISubjectData) =>
                updateSubjectId(newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  id="subjectId"
                  label="Subject"
                  {...register("subjectId", { required: true })}
                  error={!!errors.subjectId}
                  helperText={errors?.subjectId?.message}
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="content"
          render={() => (
            <div>
              <Editor
                initialValue="<p>New topic content</p>"
                apiKey="xbc0e10hc6qsmznr1r3ez6bnw3ozol916ykuebp3u5gqzggw"
                onEditorChange={(a) => setValue("content", a)}
                {...register("content", { required: true })}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image",
                    "charmap print preview anchor help",
                    "searchreplace visualblocks code",
                    "insertdatetime media table paste wordcount",
                  ],
                  toolbar:
                    "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
                }}
              />
              <FormHelperText error={!!errors.content}>
                {errors && errors.content && errors?.content.message}
              </FormHelperText>
            </div>
          )}
        />
        <Divider />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={loading}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
