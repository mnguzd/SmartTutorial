import { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ITopicData } from "../services/api/models/ITopicData";
import { getTopic } from "../services/api/TopicsApi";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import SubjectPage from "./SubjectPage";
import { Typography } from "@material-ui/core";
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
  const [topic, setTopic] = useState<ITopicData | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const classes = useStyles();

  useEffect(() => {
    async function getTopicAsync() {
      if (match.params.topicId) {
        setLoading(true);
        const ID: number = Number(match.params.topicId);
        const data = await getTopic(ID);
        setTopic(data);
        setLoading(false);
      }
    }
    window.scrollTo(0, 0);
    getTopicAsync();
    prism.highlightAll();
  }, [match.params.topicId, topic?.content]);
  return (
    <SubjectPage isContentLoading={loading}>
      <div>
            <Typography className={classes.bold} variant="h6" align="center">
              {topic?.name}
            </Typography>
            {topic ?(parse(topic.content)):("Content is not loaded")}
      </div>
    </SubjectPage>
  );
};
export default TopicPage;
