import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import StyledLink from "../Styled";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form/";
import Container from "@material-ui/core/Container";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = yup.object().shape({
  firstName: yup
    .string()
    .max(20, "Your firstname is longer than 20 characters")
    .min(4, "Your firstname is shorter than 4 characters")
    .required("Enter your firstname"),
  lastName: yup
    .string()
    .max(20, "Your firstname is longer than 20 characters")
    .min(4, "Your firstname is shorter than 4 characters")
    .required("Enter your firstname"),
  emailAdress: yup
    .string()
    .required("Enter your email")
    .email("Email is not correct"),
  password: yup
    .string()
    .max(80, "Your password is longer than 80 characters")
    .min(8, "Your password is shorter than 8 characters")
    .required("Enter your password"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});
interface IFormInputs {
  firstName: string;
  lastName: string;
  emailAdress: string;
  password: string;
  passwordConfirm: string;
}
export default function SignUp() {
  const classes = useStyles();
  const {
    register,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({ mode: "onBlur", resolver: yupResolver(schema) });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <LockOutlinedIcon className={classes.avatar} fontSize="large" />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: true,
                }}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    {...register("firstName", { required: true })}
                    error={errors.firstName !== undefined}
                    helperText={errors?.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="lastName"
                rules={{
                  required: true,
                }}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    {...register("lastName", { required: true })}
                    error={errors.lastName !== undefined}
                    helperText={errors?.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="emailAdress"
                rules={{
                  required: true,
                }}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email Address"
                    {...register("emailAdress", { required: true })}
                    error={errors.emailAdress !== undefined}
                    helperText={errors?.emailAdress?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: true,
                }}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    {...register("password", { required: true })}
                    error={errors.password !== undefined}
                    helperText={errors?.password?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="passwordConfirm"
                rules={{
                  required: true,
                }}
                render={() => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Password confirmation"
                    type="password"
                    id="passwordConfirm"
                    {...register("passwordConfirm", { required: true })}
                    error={!!errors.passwordConfirm}
                    helperText={errors?.passwordConfirm?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <StyledLink to="/signin">
                Already have an account? Sign in
              </StyledLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
