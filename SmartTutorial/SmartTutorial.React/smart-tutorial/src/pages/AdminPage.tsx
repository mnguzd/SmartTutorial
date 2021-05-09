import { FC, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
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
import { useAuth } from "../auth/Auth";
import { UserRole } from "../auth/UserRoles";

const useStyles = makeStyles((theme: Theme) =>
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
      padding: theme.spacing(3),
    },
  })
);

interface Props {
  title?: string;
}

const AdminPage: FC<Props> = ({ title, children }) => {
  const classes = useStyles();
  const { user, loading } = useAuth();
  const history = useHistory();
  useEffect(() => {
    if (!loading && user) {
      if (user.role === UserRole.User) {
        history.push("/");
      }
    }
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
              <ListItem button component={Link} to="/admin/themes">
                <ListItemIcon>
                  <PermMedia />
                </ListItemIcon>
                <ListItemText primary="Themes" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <FolderOpen />
                </ListItemIcon>
                <ListItemText primary="Subjects" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText primary="Topics" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <QuestionAnswer />
                </ListItemIcon>
                <ListItemText primary="Questions" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
              <ListItem button>
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
