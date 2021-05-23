import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  PermMedia,
  Description,
  FolderOpen,
  QuestionAnswer,
  People,
  Fingerprint,
} from "@material-ui/icons";
import { useAuth } from "../../auth/Auth";
import { UserRole } from "../../auth/UserRoles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
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
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  })
);

interface Props {
  title?: string;
}

const AdminPage: FC<Props> = ({ title, children }) => {
  const classes = useStyles();
  const { user, loading } = useAuth();
  const [selectedPath,setSelectedPath] = useState<string>("");
  const history = useHistory();
  useEffect(() => {
    if (!loading && user) {
      if (user.role === UserRole.User) {
        history.push("/");
      }
    }
    setSelectedPath(history.location.pathname);
  }, [history, loading, user]);
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={classes.root}>
        <div className={classes.appBar}>
          <Header />
        </div>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              <ListItem
                selected={selectedPath === "/admin/courses"}
                button
                component={Link}
                to="/admin/courses"
              >
                <ListItemIcon>
                  <PermMedia />
                </ListItemIcon>
                <ListItemText primary="Courses" />
              </ListItem>
              <ListItem
                selected={selectedPath === "/admin/subjects"}
                button
                component={Link}
                to="/admin/subjects"
              >
                <ListItemIcon>
                  <FolderOpen />
                </ListItemIcon>
                <ListItemText primary="Subjects" />
              </ListItem>
              <ListItem
                selected={selectedPath === "/admin/topics"}
                button
                component={Link}
                to="/admin/topics"
              >
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText primary="Topics" />
              </ListItem>
              <ListItem
                selected={selectedPath === "/admin/questions"}
                button
                component={Link}
                to="/admin/questions"
              >
                <ListItemIcon>
                  <QuestionAnswer />
                </ListItemIcon>
                <ListItemText primary="Questions" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem
                selected={selectedPath === "/admin/users"}
                button
              >
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
              <ListItem
                selected={selectedPath === "/admin/roles"}
                button
              >
                <ListItemIcon>
                  <Fingerprint />
                </ListItemIcon>
                <ListItemText primary="Roles" />
              </ListItem>
            </List>
          </div>
        </Drawer>
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
};
export default AdminPage;
