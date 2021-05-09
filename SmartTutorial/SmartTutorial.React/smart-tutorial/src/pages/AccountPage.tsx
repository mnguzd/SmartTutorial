import { Box, Breadcrumbs, Container, Grid } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import AccountProfile from "../components/Account/AccountProfile";
import AccountProfileDetails from "../components/Account/AccountProfileDetails";
import { makeStyles } from "@material-ui/core/styles";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../auth/Auth";
import { useEffect } from "react";
import Page from "./Page";
import ProgressCircle from "../components/ProgressCircle";

const useStyles = makeStyles((theme) => ({
  box: {
    minHeight: "100%",
    margin: theme.spacing(3, 0, 0, 0),
  },
  bread: {
    margin: theme.spacing(3, 0, 0, 3),
  },
}));

export default function AccountPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const history = useHistory();
  const classes = useStyles();
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      history.push("/");
    }
  }, [history, loading, isAuthenticated]);
  return (
    <Page title="Profile">
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
      {loading ? (
        <ProgressCircle color="primary" />
      ) : (
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
      )}
    </Page>
  );
}
