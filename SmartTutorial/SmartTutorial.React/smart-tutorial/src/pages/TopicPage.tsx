import { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ITopicData } from "../services/api/models/ITopicData";
import { getTopic } from "../services/api/TopicsApi";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ProgressCircle from "../components/ProgressCircle";
import parse from "html-react-parser";
import SubjectPage from "./SubjectPage";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    bread: {
      marginTop: theme.spacing(10),
      marginBottom:theme.spacing(2),
    },
    bold:{
      fontWeight:600,
    }
  })
);

interface IRouteParams {
  topicId: string;
}

const TopicPage: FC<RouteComponentProps<IRouteParams>> = ({ match }) => {
  const [topic, setTopic] = useState<ITopicData | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const classes = useStyles();

  useEffect(() => {
    async function getTopicAsync() {
      if (match.params.topicId) {
        const ID: number = Number(match.params.topicId);
        const data = await getTopic(ID);
        setTopic(data);
      }
    }
    setLoading(true);
    getTopicAsync();
    setLoading(false);
  }, [match.params.topicId]);
  return (
    <SubjectPage>
      <div>
        {loading ? (
          <ProgressCircle color="primary" />
        ) : (
          <div>
            <Typography className={classes.bold} variant="h6" align="center">{topic?.name}</Typography>
            {topic && parse(topic.content)}
          </div>
        )}
      </div>
    </SubjectPage>
  );
};
export default TopicPage;
