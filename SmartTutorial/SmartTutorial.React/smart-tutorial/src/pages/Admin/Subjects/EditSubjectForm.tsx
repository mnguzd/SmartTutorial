import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form/";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  getSubject,
  updateTheSubject,
} from "../../../services/api/SubjectApi";
import { Autocomplete } from "@material-ui/lab";
import { getCourses } from "../../../services/api/CourseApi";
import { ICourse } from "../../../services/api/models/ICourse";
import { IServerCreateSubjectError } from "../../../services/api/models/errors/ISubjectErrors";
import { ISubject } from "../../../services/api/models/ISubject";
import ProgressCircle from "../../../components/ProgressCircle";

const useStyles = makeStyles((theme) => ({
  buttons: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cancelButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

const schema = yup.object().shape({
  name: yup
    .string()
    .max(100, "Name is longer than 100 characters")
    .min(2, "Name is shorter than 2 characters")
    .required("Enter the name"),
  complexity: yup
    .number()
    .max(5, "Complexity is more than 5 points")
    .min(0, "Complexity is less than 0 points")
    .required("Enter the complexity"),
  courseId: yup.number().required("Enter courseId"),
});

interface IFormInputs {
  name: string;
  complexity: number;
  courseId: number;
}
interface Props {
  accessToken: string;
  setOpenPopup: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  callBack: ICallback;
  subjectId: number | undefined;
}
interface ICallback {
  (): void;
}

export const EditSubjectForm: FC<Props> = ({
  accessToken,
  setOpenPopup,
  loading,
  callBack,
  subjectId,
}) => {
  const classes = useStyles();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [subject, setSubject] = useState<ISubject>();
  const [subjectLoading, setSubjectLoading] = useState<boolean>(true);

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

  async function onSubmit(data: IFormInputs) {
    if (subject) {
      const result: IServerCreateSubjectError | null = await updateTheSubject(
        subject.id,
        data,
        accessToken
      );
      if (result) {
        setError(result.name, { type: result.type, message: result.message });
      } else {
        callBack();
        setOpenPopup(false);
      }
    }
  }

  function setCourseId(newValue: ICourse | null): void {
    if (newValue) {
      setValue("courseId", newValue.id);
    }
  }

  const setCoursesAsync = useCallback(async function SetCourses() {
    setCoursesLoading(true);
    const result: ICourse[] = await getCourses();
    setCourses(result);
    setCoursesLoading(false);
  }, []);
  const setSubjectAsync = useCallback(
    async function SetSubject() {
      setSubjectLoading(true);
      if (subjectId) {
        const result: ISubject | null = await getSubject(
          subjectId,
        );
        result && setSubject(result);
      }
      setSubjectLoading(false);
    },
    [subjectId]
  );
  useEffect(() => {
    setCoursesAsync();
    setSubjectAsync();
  }, [setCoursesAsync, setSubjectAsync]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title={`Edit subject (${subject?(subject.id):("")})`} />
        <Divider />
        {subjectLoading ? (
          <ProgressCircle color="secondary" />
        ) : (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="name"
                  defaultValue={subject?.name}
                  render={() => (
                    <TextField
                      autoFocus
                      fullWidth
                      defaultValue={subject?.name}
                      id="name"
                      label="Name"
                      {...register("name", { required: true })}
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      onChange={(e) => setValue("name", e.target.value)}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="complexity"
                  defaultValue={subject?.complexity}
                  render={() => (
                    <TextField
                      fullWidth
                      defaultValue={subject?.complexity}
                      id="complexity"
                      label="Complexity"
                      {...register("complexity", { required: true })}
                      error={!!errors.complexity}
                      helperText={errors?.complexity?.message}
                      onChange={(e) =>
                        setValue("complexity", Number(e.target.value))
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="courseId"
                  defaultValue={subject?.course.id}
                  render={() => (
                    <Autocomplete
                      id="coursesAutocomplete"
                      options={courses}
                      getOptionLabel={(option) => option.name}
                      defaultValue={subject?.course}
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      loading={coursesLoading}
                      onChange={(_e, newValue: ICourse | null) =>
                        setCourseId(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          defaultValue={subject?.course.id}
                          fullWidth
                          id="courseId"
                          label="Course"
                          {...register("courseId", { required: true })}
                          error={!!errors.courseId}
                          helperText={errors?.courseId?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        )}
        <Divider />
        <Grid
          container
          direction="row"
          justify="flex-end"
          className={classes.buttons}
        >
          <Button
            color="primary"
            variant="outlined"
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => setOpenPopup(false)}
            disabled={loading}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
        </Grid>
      </Card>
    </form>
  );
};
