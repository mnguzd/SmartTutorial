import React, { useState, useEffect } from "react";
import axios from "axios";
import { webAPIUrl } from "../AppSettings";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import ThemeCard from "../components/Theme/ThemeCard";
import { IThemeData } from "../data/ThemeData";
import Footer from "../components/Footer/Footer";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 0),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(0),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));
export default function HomePage() {
  const [data, setData] = useState<IThemeData[]>([]);
  const classes = useStyles();
  useEffect(() => {
    axios
      .get<IThemeData[]>(webAPIUrl + "/themes", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
      });
  }, []);

  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          WebTutor
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Why is this site called like that? Just because you will learn
          everything faster. No matter what age you are. No matter what
          knowledge you have. By coming here, you will become smarter.
        </Typography>
      </Container>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {data.map((theme) => (
              <Grid item key={theme.id} xs={12} sm={6} md={4}>
            <ThemeCard {...theme} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer/>
    </div>
  );
}
