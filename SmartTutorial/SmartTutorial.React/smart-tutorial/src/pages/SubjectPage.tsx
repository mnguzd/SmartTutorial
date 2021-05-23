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
} from "@material-ui/core";
import Header from "../components/Header/Header";
import { Helmet } from "react-helmet";
import { ISubjectDataWithTopics } from "../services/api/models/ISubjectData";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import { Home, ChevronLeft } from "@material-ui/icons";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import clsx from "clsx";
import Footer from "../components/Footer/Footer";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      margin: 0,
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
      marginBottom: theme.spacing(-1),
      justifyContent: "flex-end",
    },
    container: {
      marginTop: theme.spacing(20),
    },
    mainIcon: {
      marginRight: theme.spacing(2),
    },
    content: {
      marginLeft: -200,
      padding: theme.spacing(2),
    },
    contentShift: {
      marginLeft: 0,
      padding: theme.spacing(2),
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(5),
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
  courseId: string;
}
interface Props {
  isContentLoading: boolean;
}

const SubjectPage: FC<Props> = ({ children, isContentLoading }) => {
  const [subject, setSubject] = useState<ISubjectDataWithTopics | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const params = useParams<IRouteParams>();
  const history = useHistory();

  const classes = useStyles();

  const handleChange = (value: number) => {
    setPage(value);
    history.push(
      `/courses/${subject?.course.id}/subjects/${subject?.id}/topics/${
        subject?.topics[value - 1].id
      }`
    );
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function getSubject() {
      if (params.subjectId) {
        const ID: number = Number(params.subjectId);
        const data = await getSubjectWithTopics(ID);
        data?.topics.sort((x, y) => x.order - y.order);
        if (
          typeof params.topicId === "undefined" &&
          data &&
          data?.topics.length > 0
        ) {
          setSelectedTopicId(Number(data.topics[0].id));
          history.push(
            `/courses/${data.course.id}/subjects/${data.id}/topics/${data.topics[0].id}`
          );
        }
        setSubject(data);
        if (params.topicId) {
          setSelectedTopicId(Number(params.topicId));
          if (data) {
            const topic = data.topics.find(
              (x) => x.id === Number(params.topicId)
            );
            if (topic) {
              setPage(data.topics.indexOf(topic) + 1);
            }
          }
        }
      }
    }
    getSubject();
  }, [history, params.subjectId, params.topicId]);
  return (
    <div>
      <Helmet>
        <title>{subject ? subject.name : ""}</title>
      </Helmet>
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
              <ChevronLeft color="primary" />
            </IconButton>
          </div>
          <div className={classes.drawerContainer}>
            <List dense={true}>
              {subject?.topics.map((value, index) => (
                <ListItem
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
            {subject ? (
              <StyledBreadcrumb
                component={Link}
                to={`/courses/${subject.course.id}`}
                label={`${subject.course.name}`}
                clickable
              />
            ) : null}
            {subject ? <StyledBreadcrumb label={`${subject.name}`} /> : null}
          </Breadcrumbs>
          {children ? (
            <div>
              {children}
              {isContentLoading ? (
                <ProgressCircle color="primary" />
              ) : (
                <div>
                  <Pagination
                    count={subject?.topics.length}
                    className={classes.pagination}
                    page={page}
                    onChange={(_e, v) => handleChange(v)}
                    color="primary"
                  ></Pagination>
                  <Footer />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default SubjectPage;
