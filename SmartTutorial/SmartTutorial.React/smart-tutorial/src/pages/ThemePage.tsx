import { FC, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { IThemeDataWithSubjects } from "../data/ThemeData";
import axios from "axios";
import { webAPIUrl } from "../AppSettings";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FolderIcon from "@material-ui/icons/Folder";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import ProgressCircle from "../components/ProgressCircle";

interface IRouteParams {
  themeId: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(6, 0, 5, 0),
  },
}));

const ThemePage: FC<RouteComponentProps<IRouteParams>> = ({
  match,
}) => {
  const [theme, setTheme] = useState<IThemeDataWithSubjects | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  useEffect(() => {
    if (match.params.themeId) {
      const ID: number = Number(match.params.themeId);
      axios
        .get<IThemeDataWithSubjects>(webAPIUrl + "/themes/" + ID.toString(), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setTheme(response.data);
          setLoading(false);
        });
    }
  }, [match.params.themeId]);
  return (
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
  );
};
export default ThemePage;
