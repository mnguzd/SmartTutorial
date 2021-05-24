import { createStyles, makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
  })
);
interface Props {
  color: "primary" | "secondary" | "inherit";
}

export default function ProgressCircle(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress color={props.color} />
    </div>
  );
}
