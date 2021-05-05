import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import ThemeCard from "../components/Theme/ThemeCard";
import { IThemeData } from "../data/ThemeData";
import Footer from "../components/Footer/Footer";
import ProgressCircle from "../components/ProgressCircle";
import Page from "./Page";
import { useAuth } from "../auth/Auth";
import { getThemes } from "../services/api/ThemesApi";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 0),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(0),
  },
  snackBarContent: {
    backgroundColor: "#D55C81",
  },
  snackBarIcon: {
    fill: "#FAFAFA",
  },
}));

export default function HomePage() {
  const classes = useStyles();
  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & { children?: React.ReactElement<any, any> }
    >;
  }>({
    open: false,
    Transition: Fade,
  });

  const { loginSuccess, user, calmSuccess } = useAuth();

  const [data, setData] = useState<IThemeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleClick = (
    Transition: React.ComponentType<
      TransitionProps & { children?: React.ReactElement<any, any> }
    >
  ) => {
    setState({
      open: true,
      Transition,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  useEffect(() => {
    const getThemesAsync = async () => {
      setLoading(true);
      const themes = await getThemes();
      setData(themes);
      setLoading(false);
    };
    getThemesAsync();
    if (loginSuccess) {
      handleClick(SlideTransition);
      calmSuccess();
    }
  }, [calmSuccess, loginSuccess]);

  return (
    <Page title="WebTutor | Home">
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={state.open}
        autoHideDuration={2000}
        onClose={handleClose}
        TransitionComponent={state.Transition}
      >
        <SnackbarContent
          className={classes.snackBarContent}
          message={
            <Typography variant="body2">
              {`Hello, ${user?.username}`}
            </Typography>
          }
          action={
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon fontSize="small" className={classes.snackBarIcon} />
            </IconButton>
          }
        />
      </Snackbar>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            WebTutor
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            Why is this site called like that? Just because you will learn
            everything faster. No matter what age you are. No matter what
            knowledge you have. By coming here, you will become smarter.
          </Typography>
        </Container>
        <Container className={classes.cardGrid} maxWidth="md">
          {loading ? (
            <ProgressCircle />
          ) : (
            <Grid container spacing={4}>
              {data.map((theme) => (
                <Grid item key={theme.id} xs={12} sm={6} md={4}>
                  <ThemeCard {...theme} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
        <Footer />
      </div>
    </Page>
  );
}
