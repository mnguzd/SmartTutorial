import { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { getSubjectWithTopics } from "../services/api/SubjectsApi";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";
import ProgressCircle from "../components/ProgressCircle";
import { StyledBreadcrumb } from "../components/StyledBreadcrumb";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Page from "./Page";
import {ISubjectDataWithTopics} from "../services/api/models/ISubjectData";

const useStyles = makeStyles((theme) => ({
  bread: {
    margin: theme.spacing(3, 0, 0, 3),
  },
}));

interface IRouteParams {
  subjectId: string;
}

const SubjectPage: FC<RouteComponentProps<IRouteParams>> = ({ match }) => {
  const [subject, setSubject] = useState<ISubjectDataWithTopics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  useEffect(() => {
    async function getSubject() {
      if (match.params.subjectId) {
        const ID: number = Number(match.params.subjectId);
        const data = await getSubjectWithTopics(ID);
        setSubject(data);
      }
    }

    setLoading(true);
    getSubject();
    setLoading(false);
  }, [match.params.subjectId]);
  return (
    <Page title={`Subject | ${subject?.name}`}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.bread}>
        <StyledBreadcrumb
          component={Link}
          to="/"
          label="Home"
          clickable
          icon={<HomeIcon />}
        />
        <StyledBreadcrumb
          component={Link}
          to={`/themes/${subject?.theme.id}`}
          label={`${subject?.theme.name}`}
          clickable
        />
        <StyledBreadcrumb label={subject?.name} />
      </Breadcrumbs>
      {loading ? <ProgressCircle color="primary" /> : <div>hello</div>}
    </Page>
  );
};
export default SubjectPage;
