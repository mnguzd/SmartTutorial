import { FC, useState, useEffect } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Breadcrumbs,
  Grid,
  InputBase,
  Chip,
} from "@material-ui/core";
import { Home, Search } from "@material-ui/icons";
import { makeStyles, fade } from "@material-ui/core/styles";
import { getThemeWithSubjects } from "../services/api/ThemesApi";
import { IThemeDataWithSubjects } from "../services/api/dtos/ThemeData";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import ProgressCircle from "../components/ProgressCircle";
import Page from "./Page";

interface IRouteParams {
  themeId: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(6, 0, 5, 0),
  },
  bread: {
    margin: theme.spacing(3, 0, 0, 3),
  },
  light: {
    color: "white",
    backgroundColor: "#4caf50",
  },
  medium: {
    color: "white",
    backgroundColor: "#ff9800",
  },
  hard: {
    color: "white",
    backgroundColor: "#f44336",
  },
  root: {
    width: "100%",
    maxWidth: 360,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const ThemePage: FC<RouteComponentProps<IRouteParams>> = ({ match }) => {
  const [theme, setTheme] = useState<IThemeDataWithSubjects | null>(null);
  const [searchTerm, setSeatchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  useEffect(() => {
    const getThemeAsync = async () => {
      setLoading(true);
      if (match.params.themeId) {
        const ID: number = Number(match.params.themeId);
        const theme = await getThemeWithSubjects(ID);
        setTheme(theme);
      }
      setLoading(false);
    };
    getThemeAsync();
  }, [match.params.themeId]);
  return (
    <Page title={"Theme | " + theme?.name}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.bread}>
        <StyledBreadcrumb
          component={Link}
          to="/"
          label="Home"
          clickable
          icon={<Home />}
        />
        <StyledBreadcrumb label={theme?.name} />
      </Breadcrumbs>
      <Grid
        className={classes.container}
        container
        direction="column"
        alignItems="center"
        spacing={6}
      >
        <Grid item>
          <Typography variant="h5" align="center" paragraph>
            {theme?.name}
          </Typography>
          <Typography variant="body1" align="center">
            {theme?.description}
          </Typography>
        </Grid>
        <Grid item>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search color="primary" />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => {
                setSeatchTerm(e.target.value);
              }}
            />
          </div>
        </Grid>
        <Grid item className={classes.root}>
          {loading ? (
            <ProgressCircle />
          ) : (
            <List dense={false}>
              {theme?.subjects
                .filter((val) =>
                  val.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((subject, index) => (
                  <ListItem
                    button
                    component={Link}
                    to={`/themes/${theme.id}/subjects/${subject.id}`}
                    key={subject.id.toString()}
                    divider={index < theme.subjects.length - 1}
                  >
                    <ListItemIcon>
                      <Chip
                        size="small"
                        label={subject.complexity}
                        className={`${classes.light} ${
                          subject.complexity < 3
                            ? classes.light
                            : subject.complexity < 5
                            ? classes.medium
                            : classes.hard
                        }`}
                      />
                    </ListItemIcon>
                    <ListItemText primary={subject.name} />
                  </ListItem>
                ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Page>
  );
};
export default ThemePage;
