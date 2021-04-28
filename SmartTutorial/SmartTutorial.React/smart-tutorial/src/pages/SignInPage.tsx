import Button from "@material-ui/core/Button";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Controller, useForm } from "react-hook-form/";
import StyledLink from "../Styled";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../auth/Auth";
import * as yup from "yup";
import { useEffect } from "react";

const schema = yup.object().shape({
  username: yup
    .string()
    .max(20, "Your username is longer than 20 characters")
    .min(4, "Your username is shorter than 4 characters")
    .required("Enter your username"),
  password: yup
    .string()
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
}));

interface IFormInputs{
  username:string;
  password:string;
}

export default function SignIn() {
  const { logIn, isAuthenticated } = useAuth();

  const history = useHistory();

  const classes = useStyles();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInputs>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  function onSubmit(data: IFormInputs) {
    logIn(data);
  }

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated, history]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <AssignmentIndIcon className={classes.avatar} fontSize="large" />
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
            render={() => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                {...register("username", { required: true })}
                error={errors.username !== undefined}
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
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                id="password"
                {...register("password", { required: true })}
                error={errors.password !== undefined}
                helperText={errors?.password?.message}
                onChange={(e) => setValue("password", e.target.value)}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
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
  );
}
