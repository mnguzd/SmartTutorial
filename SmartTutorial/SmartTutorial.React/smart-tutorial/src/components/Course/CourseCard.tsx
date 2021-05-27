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
import {ICourse} from "../../services/api/models/ICourse";

const useStyles = makeStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

export default function CourseCard(course: ICourse) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardMedia
        component="img"
        alt={course.name}
        height="180"
        image={course.imageUrl}
        title={course.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {course.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {course.description.slice(0, 100) + "..."}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/courses/${course.id.toString()}`}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
