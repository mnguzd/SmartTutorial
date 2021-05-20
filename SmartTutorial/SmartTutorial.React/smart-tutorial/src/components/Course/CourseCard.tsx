import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {ICourseData} from "../../services/api/models/ICourseData";

const useStyles = makeStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

export default function ThemeCard(theme: ICourseData) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardMedia
        component="img"
        alt={theme.name}
        height="180"
        image={theme.imageUrl}
        title={theme.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {theme.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {theme.description.slice(0, 100) + "..."}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/themes/${theme.id.toString()}`}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
