import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IThemeData } from "../../data/ThemeData";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import StyledLink from '../../Styled';
const useStyles = makeStyles({
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
});

export default function ThemeCard(theme: IThemeData) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <StyledLink to={"/themes/"+theme.id.toString()}>
      <CardActionArea>
        <CardMedia
          className={classes.cardMedia}
          image={theme.imageUrl}
          title={theme.name}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h6" component="h2">
            {theme.name}
          </Typography>
          <Typography variant="body2">
            {theme.description.slice(0, 100) + "..."}
          </Typography>
        </CardContent>
        <CardActions>
          <Typography color="primary">Exlpore...</Typography>
        </CardActions>
      </CardActionArea>
      </StyledLink>
    </Card>
  );
}
