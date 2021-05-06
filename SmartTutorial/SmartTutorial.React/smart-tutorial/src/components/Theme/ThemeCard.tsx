import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { IThemeData } from "../../data/ThemeData";
import CardMedia from "@material-ui/core/CardMedia";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

export default function ThemeCard(theme: IThemeData) {
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
