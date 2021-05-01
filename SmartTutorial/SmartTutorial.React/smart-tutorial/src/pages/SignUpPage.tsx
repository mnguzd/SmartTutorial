import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import StyledLink from "../components/StyledLink";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form/";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Checkbox from "@material-ui/core/Checkbox";
import HomeIcon from "@material-ui/icons/Home";
import FormHelperText from "@material-ui/core/FormHelperText";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import * as yup from "yup";
import { useAuth, IServerSignUpError } from "../auth/Auth";
import { useEffect } from "react";
import Page from "./Page";

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
  bread: {
    margin: theme.spacing(3, 0, 0, 3),
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
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
  terms: yup.boolean().oneOf([true], "You must read the Terms and Conditions"),
});
interface IFormInputs {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  terms: boolean;
}

export default function SignUp() {
  const classes = useStyles();

  const { isAuthenticated, signUp } = useAuth();

  const history = useHistory();

  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    setError,
  } = useForm<IFormInputs>({ mode: "onBlur", resolver: yupResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated, history]);
  async function onSubmit(data: IFormInputs) {
    const result: IServerSignUpError | null = await signUp(data);
    if (result != null) {
      setError(result.name, { type: result.type, message: result.message });
    } else {
      history.push("/signin");
    }
  }
  return (
    <Page title="WebTutor | Sign-Up">
      <Breadcrumbs aria-label="breadcrumb" className={classes.bread}>
        <StyledBreadcrumb
          component={Link}
          to="/"
          label="Home"
          clickable
          icon={<HomeIcon />}
        />
        <StyledBreadcrumb label="Sign Up" />
      </Breadcrumbs>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <LockOutlinedIcon
            className={classes.avatar}
            fontSize="large"
            color="secondary"
          />
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
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
                      onChange={(e) => setValue("password", e.target.value)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="passwordConfirm"
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
                      onChange={(e) =>
                        setValue("passwordConfirm", e.target.value)
                      }
                    />
                  )}
                />
              </Grid>
              <FormControlLabel
                label="I have read the Terms and Conditions"
                control={
                  <Controller
                    name="terms"
                    control={control}
                    defaultValue={false}
                    render={() => (
                      <Checkbox
                        id="terms"
                        defaultChecked={false}
                        {...register("terms", { required: true })}
                        onChange={(e) => setValue("terms", e.target.checked)}
                      />
                    )}
                  />
                }
              />
              {Boolean(errors.terms) && (
                <FormHelperText error>{errors.terms?.message}</FormHelperText>
              )}
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
    </Page>
  );
}
