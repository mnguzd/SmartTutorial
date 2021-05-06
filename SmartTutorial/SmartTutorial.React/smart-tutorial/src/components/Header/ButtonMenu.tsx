import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MenuList from "@material-ui/core/MenuList";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    userButton: {
      textTransform: "none",
    },
    info: {
      padding: theme.spacing(1, 1, 1, 1),
    },
    avatar: {
      marginBottom: theme.spacing(1),
    },
    bold: {
      fontWeight: "bold",
    },
  })
);

interface IUser {
  username: string;
  firstname: string;
  lastname: string;
  avatar: string;
  email: string;
}

export default function ButtonMenu(user: IUser) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          className={classes.userButton}
          color="inherit"
          onClick={handleToggle}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {user.username}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                    color="inherit"
                  >
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                      className={classes.info}
                    >
                      <Avatar
                        className={classes.avatar}
                        alt={user.username}
                        src={user.avatar}
                      />
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        gutterBottom
                        className={classes.bold}
                      >
                        {user.firstname + " " + user.lastname}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.email}
                      </Typography>
                    </Grid>
                    <Divider />
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit">Profile</Typography>
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/settings"
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit">Settings</Typography>
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/logout"
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit">Logout</Typography>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
