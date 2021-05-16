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
  createNewSubject,
  IServerCreateSubjectError,
} from "../../../services/api/SubjectsApi";
import { Autocomplete } from "@material-ui/lab";
import { IThemeData } from "../../../services/api/dtos/ThemeData";
import { getThemes } from "../../../services/api/ThemesApi";

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
    .min(0, "Complexity is less than 5 points")
    .required("Enter the complexity"),
  themeId: yup.number().required("Enter themeId"),
});

interface IFormInputs {
  name: string;
  complexity: number;
  themeId: number;
}
interface Props {
  accessToken: string;
  setOpenPopup: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  callBack: ICallback;
}
interface ICallback {
  (): void;
}

export const CreateSubjectForm: FC<Props> = ({
  accessToken,
  setOpenPopup,
  loading,
  callBack,
}) => {
  const classes = useStyles();

  const [themes, setThemes] = useState<IThemeData[]>([]);
  const [themesLoading, setThemesLoading] = useState<boolean>(true);

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
    const result: IServerCreateSubjectError | null = await createNewSubject(
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

  function setThemeId(newValue: IThemeData | null): void {
    if (newValue) {
      setValue("themeId", newValue.id);
    }
  }

  const setThemesAsync = useCallback(async function SetThemes() {
    setThemesLoading(true);
    const result: IThemeData[] = await getThemes();
    setThemes(result);
    setThemesLoading(false);
  }, []);
  useEffect(() => {
    setThemesAsync();
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="New subject" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
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
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                name="complexity"
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
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
                name="themeId"
                render={() => (
                  <Autocomplete
                    id="themesAutocomplete"
                    options={themes}
                    getOptionLabel={(option) => option.name}
                    loading={themesLoading}
                    onChange={(_e, newValue: IThemeData | null) =>
                      setThemeId(newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        id="themeId"
                        label="Theme"
                        {...register("themeId", { required: true })}
                        error={!!errors.themeId}
                        helperText={errors?.themeId?.message}
                      />
                    )}
                  />
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
            variant="contained"
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            variant="contained"
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
