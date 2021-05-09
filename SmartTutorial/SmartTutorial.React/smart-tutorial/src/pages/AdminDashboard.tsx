import AdminPage from "./AdminPage";
import { Grid, Typography } from "@material-ui/core";

export default function AdminDashboard() {
  return (
    <AdminPage title="Admin | Dashboard">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={1}
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Typography color="inherit" variant="h3">
            Hello, admin
          </Typography>
        </Grid>
      </Grid>
    </AdminPage>
  );
}
