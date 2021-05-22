import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  ButtonGroup,
  CardMedia,
  Grid,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { IQuestionWithAnswers } from "../../services/api/models/IQuestionData";
import { useAuth } from "../../auth/Auth";
import {
  answerTheQuestion,
  getQuestionsByTopicId,
} from "../../services/api/QuestionApi";
import { ITopicData } from "../../services/api/models/ITopicData";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      maxWidth: 400,
    },
    root: {
      marginLeft: theme.spacing(4),
      marginTop: theme.spacing(3),
    },
    buttonGroup: {
      marginTop: theme.spacing(2),
    },
    divider: {
      marginTop: theme.spacing(1),
    },
    media: {
      height: 20,
    },
  })
);

export default function QuestionCard(topic: ITopicData) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>("");
  const { accessToken, isAuthenticated, updateUserInfo } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestionWithAnswers[]>([]);

  const classes = useStyles();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setHelperText(" ");
    setError(false);
  };
  const resetValues = () => {
    setValue("");
    setHelperText("");
    setError(false);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value) {
      setHelperText("Please select an option.");
      setError(true);
      return;
    }
    if (questions && questions[selectedIndex]) {
      let result: boolean | undefined = undefined;
      result = await answerTheQuestion(
        questions[selectedIndex].id,
        value,
        accessToken
      );
      if (result) {
        if (!questions[selectedIndex].alreadyAnswered) {
          setHelperText("Added (+1) rating!");
          updateUserInfo();
        } else {
          setHelperText("Right!");
        }
        setError(false);
      } else if (typeof result === "boolean") {
        setHelperText("Wrong");
        setError(true);
      }
      callBackQuestions();
    }
  }
  const callBackQuestions = useCallback(
    async function setQuestionsAsync() {
      if (isAuthenticated && topic) {
        const questionsData: IQuestionWithAnswers[] =
          await getQuestionsByTopicId(topic.id, accessToken);
        setQuestions(questionsData);
      }
    },
    [accessToken, isAuthenticated, topic]
  );
  useEffect(() => {
    callBackQuestions();
  }, [callBackQuestions, topic]);

  return (
    <div className={classes.root}>
      {questions &&
      questions[selectedIndex] &&
      questions[selectedIndex].answers ? (
        <Card className={classes.card} elevation={5}>
          <CardMedia
            className={classes.media}
            image="https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/12/Gradient_builder_2.jpg?auto=format&q=60&w=1815&h=1020.9375&fit=crop&crop=faces"
            title="Question mark image"
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FormControl component="fieldset" error={error} fullWidth>
                <FormLabel component="legend">
                  {questions[selectedIndex].text}
                </FormLabel>
                <Divider className={classes.divider} />
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={value}
                  onChange={handleRadioChange}
                >
                  {questions[selectedIndex].answers.map((val) => (
                    <FormControlLabel
                      value={val.text}
                      key={val.id}
                      control={<Radio />}
                      label={val.text}
                    />
                  ))}
                </RadioGroup>
                {helperText ? (
                  <Typography
                    variant="body2"
                    color={error ? "secondary" : "primary"}
                  >
                    {helperText}
                  </Typography>
                ) : null}
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <ButtonGroup
                    variant="outlined"
                    color="primary"
                    className={classes.buttonGroup}
                  >
                    <Button
                      disabled={selectedIndex === 0}
                      onClick={() => {
                        setSelectedIndex((x) => x - 1);
                        resetValues();
                      }}
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <Button type="submit">
                      {questions[selectedIndex].alreadyAnswered
                        ? "Check answer"
                        : "Submit"}
                    </Button>
                    <Button
                      disabled={selectedIndex === questions.length - 1}
                      onClick={() => {
                        setSelectedIndex((x) => x + 1);
                        resetValues();
                      }}
                    >
                      <ChevronRightIcon />
                    </Button>
                  </ButtonGroup>
                </Grid>
              </FormControl>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
