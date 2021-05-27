import { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  Breadcrumbs,
  Chip,
  Container,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Home, Search } from "@material-ui/icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import { getCourseWithSubjects } from "../services/api/CourseApi";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import ProgressCircle from "../components/ProgressCircle";
import Page from "./Page";
import {ICourseWithSubjects} from "../services/api/models/ICourse";

interface IRouteParams {
  courseId: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(6, 0, 0, 0),
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
  mainText: {
    marginBottom: theme.spacing(4),
  },
  searchGrid: {
    marginBottom: theme.spacing(4),
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

const CoursePage: FC<RouteComponentProps<IRouteParams>> = ({ match }) => {
  const [course, setCourse] = useState<ICourseWithSubjects | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  useEffect(() => {
    const getCourseAsync = async () => {
      setLoading(true);
      if (match.params.courseId) {
        const ID: number = Number(match.params.courseId);
        const course = await getCourseWithSubjects(ID);
        setCourse(course);
      }
      setLoading(false);
    };
    getCourseAsync();
  }, [match.params.courseId]);
  return (
    <Page title={"Course | " + course?.name}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.bread}>
        <StyledBreadcrumb
          component={Link}
          to="/"
          label="Home"
          clickable
          icon={<Home />}
        />
        <StyledBreadcrumb label={course?.name} />
      </Breadcrumbs>
      <Container maxWidth="md">
        <Grid
          className={classes.container}
          container
          direction="column"
          alignItems="center"
        >
          <Grid item className={classes.mainText}>
            <Typography variant="h5" align="center" paragraph>
              {course?.name}
            </Typography>
            <Typography variant="body1" align="center">
              {course?.description}
            </Typography>
          </Grid>
          <Grid item className={classes.searchGrid}>
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
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid item className={classes.root}>
            {loading ? (
              <ProgressCircle color="primary" />
            ) : (
              <List dense={false}>
                {course?.subjects
                  .filter((val) =>
                    val.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((subject, index) => (
                    <ListItem
                      button
                      component={Link}
                      to={`/courses/${course.id}/subjects/${subject.id}`}
                      key={subject.id.toString()}
                      divider={index < course.subjects.length - 1}
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
      </Container>
    </Page>
  );
};
export default CoursePage;
