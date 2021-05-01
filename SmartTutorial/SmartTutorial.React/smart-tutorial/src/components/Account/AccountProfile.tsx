import moment from "moment";
import { Box, Card, CardContent, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {IUser} from "../../auth/Auth";

const useStyles = makeStyles((theme) => ({
  box: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
}));

const AccountProfile = (user: IUser) => {
  const classes = useStyles();

  return (
    <Card {...user}>
      <CardContent>
        <Box className={classes.box}>
          <Typography color="textPrimary" gutterBottom variant="h3">
            {user.firstname+" "+user.lastname}
          </Typography>
          <Typography color="textSecondary" gutterBottom variant="h3">
            {"Rating: " + user.rating}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {user?.country}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {moment().format("hh:mm A")}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default AccountProfile;
