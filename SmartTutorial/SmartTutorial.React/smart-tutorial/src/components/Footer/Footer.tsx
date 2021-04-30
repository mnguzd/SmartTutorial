import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import IconButton from "@material-ui/core/IconButton";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  footer: {
    padding:theme.spacing(5,0,5,0),
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
        <Grid container direction="column" justify="center" alignItems="center" className={classes.text}>
          <Grid item>
            <Grid container direction="row">
                <Grid item>
                    <Button>
                        Home
                    </Button>
                </Grid>
                <Grid item>
                    <Button>
                        Our contacts
                    </Button>
                </Grid>
                <Grid item>
                    <Button>
                        About us
                    </Button>
                </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <IconButton  color="primary">
                  <AlternateEmailIcon></AlternateEmailIcon>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton  color="primary">
                  <LinkedInIcon></LinkedInIcon>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton  color="primary">
                  <InstagramIcon></InstagramIcon>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton color="primary">
                  <FacebookIcon></FacebookIcon>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
