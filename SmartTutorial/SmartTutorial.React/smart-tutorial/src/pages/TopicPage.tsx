import { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { ITopicData } from "../services/api/models/ITopicData";
import { getTopic } from "../services/api/TopicsApi";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import SubjectPage from "./SubjectPage";
import QuestionCard from "../components/Questions/QuestionCard";
import * as prism from "prismjs";

const useStyles = makeStyles((theme) =>
  createStyles({
    bread: {
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(2),
    },
    bold: {
      fontWeight: 600,
    },
  })
);

interface IRouteParams {
  topicId: string;
}

const TopicPage: FC<RouteComponentProps<IRouteParams>> = ({ match }) => {
  const [topic, setTopic] = useState<ITopicData>();
  const [topicLoading, setLoading] = useState<boolean>(true);

  const classes = useStyles();
  useEffect(() => {
    async function getTopicAsync() {
      if (match.params.topicId) {
        setLoading(true);
        const ID: number = Number(match.params.topicId);
        const data = await getTopic(ID);
        if (data) {
          setTopic(data);
        }
        setLoading(false);
        prism.highlightAll();
      }
    }
    window.scrollTo(0, 0);
    getTopicAsync();
  }, [match.params.topicId]);
  return (
    <SubjectPage isContentLoading={topicLoading}>
      <div>
        {topic ? (
          <div>
            <Typography className={classes.bold} variant="h6" align="center">
              {topic.name}
            </Typography>
            {parse(topic.content)}
            <QuestionCard {...topic} />
          </div>
        ) : (
          "Content is not loaded"
        )}
      </div>
    </SubjectPage>
  );
};
export default TopicPage;
