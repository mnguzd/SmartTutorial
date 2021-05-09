import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
} from "@material-ui/core";
import {
  AlternateEmail,
  Facebook,
  Instagram,
  LinkedIn,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(5, 0, 5, 0),
  },
  text: {
    padding: theme.spacing(4, 0, 0, 0),
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer} id="footer">
      <Divider variant="middle" />
      <Container maxWidth="lg">
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.text}
        >
          <Grid item>
            <Grid container direction="row">
              <Grid item>
                <Button>Home</Button>
              </Grid>
              <Grid item>
                <Button>Our contacts</Button>
              </Grid>
              <Grid item>
                <Button>About us</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <IconButton color="primary">
                  <AlternateEmail />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton color="primary">
                  <LinkedIn />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton color="primary">
                  <Instagram />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton color="primary">
                  <Facebook />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
