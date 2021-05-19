import React from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Fab,
  Toolbar,
  Typography,
  useScrollTrigger,
  Zoom,
} from "@material-ui/core";
import { AccountCircle, Equalizer, KeyboardArrowUp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/Auth";
import ButtonMenu from "./ButtonMenu";
import ProgressCircle from "../ProgressCircle";

interface Props {
  children?: React.ReactElement;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2,
  },

  noDecoration: {
    textDecoration: "none",
    marginRight: theme.spacing(2),
  },
}));

function ScrollTop(props: Props) {
  const { children } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

const Header = (props: Props) => {
  const classes = useStyles();
  const { user, isAuthenticated, loading } = useAuth();
  return (
    <React.Fragment>
      <CssBaseline />
        <AppBar>
          <Toolbar>
            <Box
              display="flex"
              flexGrow={1}
              justifyItems="center"
              alignItems="center"
            >
              <Typography
                className={classes.noDecoration}
                component={Link}
                to="/"
                color="inherit"
                variant="h6"
              >
                WebTutor
              </Typography>
              <Equalizer fontSize="large" />
            </Box>
            {loading ? (
              <ProgressCircle color="secondary" />
            ) : (
              <Box ml={4}>
                {isAuthenticated && user ? (
                  <ButtonMenu {...user} />
                ) : (
                  <Button
                    component={Link}
                    to="/signin"
                    color="inherit"
                    startIcon={<AccountCircle />}
                  >
                    Sign In
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};
export default Header;
