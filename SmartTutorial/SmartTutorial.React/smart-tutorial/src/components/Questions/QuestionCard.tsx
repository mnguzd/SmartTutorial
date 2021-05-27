import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Button,
  FormControl,
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
import { IQuestionWithOptions } from "../../services/api/models/IQuestion";
import { useAuth } from "../../auth/Auth";
import {
  answerTheQuestion,
  getQuestionsByTopicId,
  getGuestQuestionsByTopicId,
} from "../../services/api/QuestionApi";
import { ITopic } from "../../services/api/models/ITopic";
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      maxWidth: 400,
      paddingBottom:theme.spacing(-2),
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
    typography:{
      marginTop:theme.spacing(1),
      marginBottom:theme.spacing(-2),
    },
    media: {
      height: 10,
      backgroundImage: "linear-gradient(to right, #EF3B36, #6a82fb);",
    },
    mediaError: {
      height: 10,
      background: "#EF3B36",
    },
    mediaRight: {
      height: 10,
      background: "#6a82fb",
    },
  })
);

export default function QuestionCard(topic: ITopic) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>("");
  const { accessToken, isAuthenticated, updateUserInfo } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestionWithOptions[]>([]);

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
      let result: boolean | undefined;
      result = await answerTheQuestion(
        questions[selectedIndex].id,
        value,
        accessToken
      );
      if (result) {
        if (!questions[selectedIndex].alreadyAnswered) {
          setHelperText("Added (+1) rating!");
          await updateUserInfo();
        } else {
          setHelperText("Right!");
        }
        setError(false);
      } else if (typeof result === "boolean") {
        setHelperText("Wrong!");
        setError(true);
      }
      await callBackQuestions();
    }
  }
  const callBackQuestions = useCallback(
    async function setQuestionsAsync() {
      if (topic) {
        if (isAuthenticated) {
          const questionsData: IQuestionWithOptions[] =
            await getQuestionsByTopicId(topic.id, accessToken);
          setQuestions(questionsData);
        } else {
          const questionsData: IQuestionWithOptions[] =
            await getGuestQuestionsByTopicId(topic.id);
          setQuestions(questionsData);
        }
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
      questions[selectedIndex].options ? (
        <Card className={classes.card} elevation={5}>
          <CardMedia
            className={`${classes.media} ${
              helperText === "Wrong!"
                ? classes.mediaError
                : helperText === "Added (+1) rating!" || helperText === "Right!"
                ? classes.mediaRight
                : classes.media
            }`}
            title="Question mark image"
            component="div"
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FormControl component="fieldset" error={error} fullWidth>
                <Typography component="legend">
                  {questions[selectedIndex].text}
                </Typography>
                <Divider className={classes.divider} />
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={value}
                  onChange={handleRadioChange}
                >
                  {questions[selectedIndex].options.map((val) => (
                    <FormControlLabel
                      value={val.text}
                      key={val.id}
                      control={
                        <Radio color="primary"/>
                      }
                      label={val.text}
                    />
                  ))}
                </RadioGroup>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <ButtonGroup
                  size="small"
                    variant="contained"
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
                    <Button type="submit" disabled={!isAuthenticated}>
                      {questions[selectedIndex].alreadyAnswered
                        ? "Check answer"
                        : isAuthenticated
                        ? "Submit"
                        : "LogIn to submit"}
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
            <Typography className={classes.typography} variant="body1" color={error ? "error" : "primary"}>
              {(selectedIndex + 1) + "/"+questions.length+" " + helperText}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
