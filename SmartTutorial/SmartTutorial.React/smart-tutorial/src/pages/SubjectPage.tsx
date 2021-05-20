import { FC, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { getSubjectWithTopics } from "../services/api/SubjectsApi";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ProgressCircle from "../components/ProgressCircle";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CssBaseline,
} from "@material-ui/core";
import Header from "../components/Header/Header";
import { Helmet } from "react-helmet";
import { ISubjectDataWithTopics } from "../services/api/models/ISubjectData";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import { Home, Close } from "@material-ui/icons";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      margin:0,
    },
    drawer: {
      width: 200,
      flexShrink: 0,
    },
    drawerPaper: {
      width: 200,
    },
    drawerContainer: {
      overflow: "auto",
    },
    drawerHeader: {
      display: "flex",
      marginTop: theme.spacing(8),
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -200,
      padding:theme.spacing(2),
      marginBottom: theme.spacing(8),
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      padding:theme.spacing(2),
      marginBottom: theme.spacing(8),
    },
    bread: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(2),
    },
    listItemText: {
      fontSize: 12,
    },
  })
);

interface IRouteParams {
  subjectId: string;
  topicId: string;
}

const SubjectPage: FC = ({ children }) => {
  const [subject, setSubject] = useState<ISubjectDataWithTopics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTopicId, setSelectedTopicId] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(true);
  const params = useParams<IRouteParams>();
  const history = useHistory();

  const classes = useStyles();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function getSubject() {
      if (params.subjectId) {
        const ID: number = Number(params.subjectId);
        const data = await getSubjectWithTopics(ID);
        setSubject(data);
      }
    }
    if (params.topicId) {
      setSelectedTopicId(Number(params.topicId));
    }
    setLoading(true);
    getSubject();
    setLoading(false);
  }, [history, params.subjectId, params.topicId]);
  return (
    <div>
      {loading ? (
        <ProgressCircle color="primary" />
      ) : (
        <div>
          <Helmet>
            <title>{subject ? subject.name : "Not found"}</title>
          </Helmet>
          <CssBaseline/>
          <div className={classes.root}>
            <div className={classes.appBar}>
              <Header setOpenDrawer={setOpen} open={open} />
            </div>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                  <Close />
                </IconButton>
              </div>
              <div className={classes.drawerContainer}>
                <List dense={true}>
                  {subject?.topics.map((value, index) => (
                    <ListItem
                      disabled={loading}
                      component={Link}
                      divider={index < subject.topics.length - 1}
                      to={`/courses/${subject.course.id}/subjects/${subject.id}/topics/${value.id}`}
                      button
                      key={value.id}
                      selected={selectedTopicId === value.id}
                    >
                      <ListItemText
                        primary={value.name}
                        classes={{ primary: classes.listItemText }}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </Drawer>
            <div
              className={clsx(classes.content, {
                [classes.contentShift]: open,
              })}
            >
              <Breadcrumbs aria-label="breadcrumb" className={classes.bread}>
                <StyledBreadcrumb
                  component={Link}
                  to="/"
                  label="Home"
                  clickable
                  icon={<Home />}
                />
                <StyledBreadcrumb
                  component={Link}
                  to={`/courses/${subject?.course.id}`}
                  label={`${subject?.course.name}`}
                  clickable
                />
                <StyledBreadcrumb
                  component={Link}
                  to={`/courses/${subject?.course.id}/subjects/${subject?.id}`}
                  label={`${subject?.name}`}
                  clickable
                />
              </Breadcrumbs>
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubjectPage;
