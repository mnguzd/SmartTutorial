import Page from "./Page";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

export default function NotFound() {
  return (
    <Page title="Page Not Found">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={1}
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <InfoOutlinedIcon fontSize="large" color="secondary" />
        </Grid>
        <Grid item>
          <Typography color="inherit" variant="h6">
            404: The page you are looking for isn’t here
          </Typography>
        </Grid>
      </Grid>
    </Page>
  );
}
