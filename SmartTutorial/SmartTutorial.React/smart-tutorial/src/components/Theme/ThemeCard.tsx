import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {IThemeData} from '../../data/ThemeData';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
});

export default function ThemeCard(theme:IThemeData) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
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
      <Typography>
        {theme.description.slice(0,90)+'...'}
      </Typography>
    </CardContent>
    </CardActionArea>
    <CardActions>
      <Button color="primary">
        View subjects
      </Button>
    </CardActions>
  </Card>
  );
}