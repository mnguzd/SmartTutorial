import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form/";
import React, { FC, useEffect } from "react";
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
import { Autocomplete } from "@material-ui/lab";
import { useAuth } from "../../../auth/Auth";
import { IServerSignUpError } from "../../../auth/models/errors/IAuthorizationErrors";
import { addToRole } from "../../../services/api/UserApi";
import { IAddToRole } from "../../../services/api/models/user/IUserData";

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
  username: yup
    .string()
    .max(20, "Your username is longer than 20 characters")
    .min(4, "Your username is shorter than 4 characters")
    .required("Enter your username"),
  email: yup
    .string()
    .required("Enter your email")
    .email("Email is not correct"),
  password: yup
    .string()
    .max(80, "Your password is longer than 80 characters")
    .min(8, "Your password is shorter than 8 characters")
    .required("Enter your password"),
  passwordConfirm: yup.string().required("Enter password confirmation"),
  role: yup.string().required("Enter the role"),
});

interface IFormInputs {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: string;
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

export const CreateUserForm: FC<Props> = ({
  accessToken,
  setOpenPopup,
  loading,
  callBack,
}) => {
  const classes = useStyles();

  const { signUp } = useAuth();

  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    setError,
    getValues,
  } = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: IFormInputs) {
    const result: IServerSignUpError | null = await signUp(data);
    if (result) {
      setError(result.name, { type: result.type, message: result.message });
    } else {
      const data: IAddToRole = {
        userName: getValues("username"),
        role: getValues("role"),
      };
      await addToRole(data, accessToken);
      callBack();
      setOpenPopup(false);
    }
  }
  useEffect(() => {});

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="New subject" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="username"
                render={() => (
                  <TextField
                    autoComplete="username"
                    autoFocus
                    variant="outlined"
                    fullWidth
                    id="username"
                    label="Username"
                    {...register("username", { required: true })}
                    error={!!errors.username}
                    helperText={errors?.username?.message}
                    onChange={(e) => setValue("username", e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="email"
                render={() => (
                  <TextField
                    autoComplete="email"
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email Address"
                    {...register("email", { required: true })}
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    onChange={(e) => setValue("email", e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="password"
                render={() => (
                  <TextField
                    autoComplete="new-password"
                    variant="outlined"
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    {...register("password", { required: true })}
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    onChange={(e) => {
                      setValue("password", e.target.value);
                      setValue("passwordConfirm", e.target.value);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="role"
                render={() => (
                  <Autocomplete
                    id="rolesAutocomplete"
                    options={["User", "Admin"]}
                    getOptionLabel={(option) => option}
                    getOptionSelected={(option, value) => option === value}
                    onChange={(_e, newValue) => {
                      newValue && setValue("role", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        id="role"
                        label="Role"
                        {...register("role", { required: true })}
                        error={!!errors.role}
                        helperText={errors?.role?.message}
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
