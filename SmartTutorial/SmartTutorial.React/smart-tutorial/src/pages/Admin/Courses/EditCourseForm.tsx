import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form/";
import React, { FC } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { editTheCourse } from "../../../services/api/CourseApi";
import { IServerCreateCourseError } from "../../../services/api/models/errors/ICourseErrors";
import { ICourse } from "../../../services/api/models/ICourse";

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
    .max(20, "Name is longer than 20 characters")
    .min(2, "Name is shorter than 2 characters")
    .required("Enter the name"),
  description: yup
    .string()
    .max(300, "Description is more than 300 characters")
    .min(10, "Description is less than 10 characters")
    .required("Enter the description"),
  imageUrl: yup
    .string()
    .url("Provide any valid image URL")
    .required("Enter the URL"),
});

interface IFormInputs {
  name: string;
  description: string;
  imageUrl: string;
}
interface Props {
  accessToken: string;
  setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  callBack: ICallback;
  course: ICourse | undefined;
}
interface ICallback {
  (): void;
}

export const EditCourseForm: FC<Props> = ({
  accessToken,
  setOpenPopup,
  loading,
  callBack,
  course,
}) => {
  const classes = useStyles();

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
    if (course) {
      const result: IServerCreateCourseError | null = await editTheCourse(
        course.id,
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
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title={"Edit course (" + course?.id + ")"} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                name="name"
                defaultValue={course?.name}
                render={() => (
                  <TextField
                    autoFocus
                    fullWidth
                    defaultValue={course?.name}
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
                name="imageUrl"
                defaultValue={course?.imageUrl}
                render={() => (
                  <TextField
                    fullWidth
                    id="imageUrl"
                    defaultValue={course?.imageUrl}
                    label="Image Url"
                    {...register("imageUrl", { required: true })}
                    error={!!errors.imageUrl}
                    helperText={errors?.imageUrl?.message}
                    onChange={(e) => setValue("imageUrl", e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                name="description"
                defaultValue={course?.description}
                render={() => (
                  <div>
                    <TextareaAutosize
                      rowsMin={4}
                      id="description"
                      defaultValue={course?.description}
                      placeholder="Description"
                      {...register("description", { required: true })}
                      onChange={(e) => setValue("description", e.target.value)}
                    />
                    <FormHelperText error={!!errors.description}>
                      {errors &&
                        errors.description &&
                        errors?.description.message}
                    </FormHelperText>
                  </div>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
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
