import {
  Breadcrumbs,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { Home, LockOpen } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form/";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../auth/Auth";
import { useEffect } from "react";
import { StyledBreadcrumb } from "../../components/StyledBreadcrumb";
import ProgressCircle from "../../components/ProgressCircle";
import StyledLink from "../../components/StyledLink";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Page from "../Page";
import { UserRole } from "../../auth/UserRoles";
import {IServerSignInError} from "../../auth/models/errors/IAuthorizationErrors";

const schema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .max(20, "Your username is longer than 20 characters")
    .min(4, "Your username is shorter than 4 characters")
    .required("Enter your username"),
  remember: yup.boolean(),
  password: yup
    .string()
    .trim()
    .max(80, "Your password is longer than 80 characters")
    .min(8, "Your password is shorter than 8 characters")
    .required("Enter your password"),
});

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
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  bread: {
    margin: theme.spacing(3, 0, 0, 3),
  },
}));

interface IFormInputs {
  username: string;
  password: string;
  remember: boolean;
}

export default function SignIn() {
  const { logIn, isAuthenticated, storedUsername, loading, user } = useAuth();

  const history = useHistory();

  const classes = useStyles();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<IFormInputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: IFormInputs) {
    const result: IServerSignInError | null = await logIn(data);
    if (result) {
      setError(result.name, { type: result.type, message: result.message });
    }
  }

  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (user?.role === UserRole.Admin) {
        history.push("/admin");
      } else {
        history.push("/");
      }
    }
  }, [isAuthenticated, history, loading, user]);

  return (
    <Page title="WebTutor | Sign In">
      <Breadcrumbs aria-label="breadcrumb" className={classes.bread}>
        <StyledBreadcrumb
          component={Link}
          to="/"
          label="Home"
          clickable
          icon={<Home />}
        />
        <StyledBreadcrumb label="Sign In" />
      </Breadcrumbs>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {loading ? (
            <ProgressCircle color="primary" />
          ) : (
            <LockOpen
              className={classes.avatar}
              fontSize="large"
              color="secondary"
            />
          )}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="username"
              defaultValue={storedUsername}
              render={() => (
                <TextField
                  autoFocus
                  autoComplete="username"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  defaultValue={storedUsername}
                  {...register("username", { required: true })}
                  error={!!errors.username}
                  helperText={errors?.username?.message}
                  onChange={(e) => setValue("username", e.target.value)}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={() => (
                <TextField
                  autoComplete="current-password"
                  variant="outlined"
                  margin="normal"
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
            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="remember"
                  control={control}
                  defaultValue={true}
                  render={() => (
                    <Checkbox
                      id="remember"
                      defaultChecked={true}
                      {...register("remember")}
                      onChange={(e) => setValue("remember", e.target.checked)}
                    />
                  )}
                />
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <StyledLink to={"/"}>Forgot password?</StyledLink>
              </Grid>
              <Grid item>
                <StyledLink to={"/signup"}>
                  Don't have an account? Sign Up
                </StyledLink>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Page>
  );
}
