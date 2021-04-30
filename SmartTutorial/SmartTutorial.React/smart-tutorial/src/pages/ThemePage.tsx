import { FC, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { IThemeDataWithSubjects } from "../data/ThemeData";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FolderIcon from "@material-ui/icons/Folder";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import ProgressCircle from "../components/ProgressCircle";
import HomeIcon from "@material-ui/icons/Home";
import Page from "./Page";
import { getThemeWithSubjects } from "../services/api/ThemesApi";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";

interface IRouteParams {
  themeId: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(6, 0, 5, 0),
  },
  bread:{
    margin:theme.spacing(3,0,0,3),
  }
}));

const ThemePage: FC<RouteComponentProps<IRouteParams>> = ({ match }) => {
  const [theme, setTheme] = useState<IThemeDataWithSubjects | null>(null);
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
      <Breadcrumbs aria-label="breadcrumb" separator="/" className={classes.bread}>
            <StyledBreadcrumb
              component={Link}
              to="/"
              label="Home"
              clickable
              icon={<HomeIcon />}
            />
            <StyledBreadcrumb component={Link} to="/" label="Themes" clickable />
            <StyledBreadcrumb label={theme?.name} />
          </Breadcrumbs>
      <Container maxWidth="sm">
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.container}
        >
          <Typography variant="h4" align="center">
            {theme?.name}
          </Typography>
          <Typography variant="body2" align="center">
            {theme?.description}
          </Typography>
          {loading ? (
            <ProgressCircle />
          ) : (
            <List dense={false}>
              {theme?.subjects.map((subject) => (
                <ListItem key={subject.id.toString()}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={subject.name}
                    secondary={"Complexity: " + subject.complexity}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
      </Container>
    </Page>
  );
};
export default ThemePage;
