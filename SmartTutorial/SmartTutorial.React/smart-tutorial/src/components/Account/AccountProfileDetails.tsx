import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form/";
import { IUser, useAuth } from "../../auth/Auth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUser, IServerEditUserError } from "../../services/api/AccountApi";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    justifyContent: "flex-end",
    margin: theme.spacing(1, 1, 1, 0),
  },
}));

const schema = yup.object().shape({
  firstname: yup
    .string()
    .max(20, "Your firstname is longer than 20 characters")
    .min(2, "Your firstname is shorter than 2 characters")
    .required("Enter your firstname"),
  lastname: yup
    .string()
    .max(20, "Your lastname is longer than 20 characters")
    .min(2, "Your lastname is shorter than 2 characters")
    .required("Enter your lastname"),
  email: yup
    .string()
    .required("Enter your email")
    .email("Email is not correct"),
  country: yup
    .string()
    .max(15, "Your country is longer than 15 characters")
    .min(2, "Your country is shorter than 2 characters")
    .nullable(),
});

export interface IAccountEditInputs {
  firstname: string;
  lastname: string;
  email: string;
  country: string;
}

const AccountProfileDetails = (user: IUser) => {
  const { token, updateUserInfo } = useAuth();
  const classes = useStyles();
  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    setError,
  } = useForm<IAccountEditInputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  async function onSubmit(data: IAccountEditInputs) {
    const result: IServerEditUserError | null = await editUser(data, token);
    if (result) {
      setError(result.name, { type: result.type, message: result.message });
    } else {
      await updateUserInfo();
    }
  }
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                name="firstname"
                defaultValue={user.firstname}
                render={() => (
                  <TextField
                    autoFocus
                    variant="outlined"
                    fullWidth
                    id="firstname"
                    label="First name"
                    defaultValue={user.firstname}
                    {...register("firstname", { required: true })}
                    error={!!errors.firstname}
                    helperText={errors?.firstname?.message}
                    onChange={(e) => setValue("firstname", e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                name="lastname"
                defaultValue={user.lastname}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="lastname"
                    label="Last name"
                    defaultValue={user.lastname}
                    {...register("lastname", { required: true })}
                    error={!!errors.lastname}
                    helperText={errors?.lastname?.message}
                    onChange={(e) => setValue("lastname", e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                name="email"
                defaultValue={user.email}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email adress"
                    defaultValue={user.email}
                    {...register("email", { required: true })}
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    onChange={(e) => setValue("email", e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                name="country"
                defaultValue={user.country}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="country"
                    label="Country"
                    defaultValue={user.country}
                    {...register("country", { required: true })}
                    error={!!errors.country}
                    helperText={errors?.country?.message}
                    onChange={(e) => setValue("country", e.target.value)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box className={classes.box}>
          <Button color="primary" variant="contained" type="submit">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AccountProfileDetails;
