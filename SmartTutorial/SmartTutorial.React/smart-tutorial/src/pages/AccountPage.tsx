import { Box, Container, Grid } from "@material-ui/core";
import AccountProfile from "../components/Account/AccountProfile";
import AccountProfileDetails from "../components/Account/AccountProfileDetails";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../auth/Auth";
import { useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";

import { useHistory } from "react-router-dom";
import Page from "./Page";

const useStyles = makeStyles((theme) => ({
  box: {
    minHeight: "100%",
    margin:theme.spacing(3,0,0,0)
  },
  bread: {
    margin: theme.spacing(3, 0, 0, 3),
  },
}));

export default function AccountPage() {
  const { user, token } = useAuth();
  const history = useHistory();
  const classes = useStyles();
  useEffect(() => {
    if (!token) {
      history.push("/");
    }
  }, [token, history]);
  return (
    <Page title={"Profile: " + user?.username}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.bread}>
        <StyledBreadcrumb
          component={Link}
          to="/"
          label="Home"
          clickable
          icon={<HomeIcon />}
        />
        <StyledBreadcrumb label="Profile" />
      </Breadcrumbs>
      <Box className={classes.box}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              {user && <AccountProfile {...user} />}
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              {user && <AccountProfileDetails {...user} />}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
}
