import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form/";
import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Radio,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { ITopicName } from "../../../services/api/models/ITopic";
import { createNewQuestion } from "../../../services/api/QuestionApi";
import { IServerCreateQuestionError } from "../../../services/api/models/errors/IQuestionErrors";
import { FormHelperText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  buttons: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cancelButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  container: {
    padding: theme.spacing(3),
  },
  firstOptions: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

const schema = yup.object().shape({
  text: yup
    .string()
    .trim()
    .max(150, "Name is longer than 150 characters")
    .min(5, "Name is shorter than 5 characters")
    .required("Enter the question"),
  answer: yup
    .string()
    .trim()
    .max(150, "Answer is longer than 150 characters")
    .min(1, "Answer is shorter than 1 character")
    .required("Enter the answer"),
  option1: yup
    .string()
    .trim()
    .max(150, "Option 1 is longer than 150 characters")
    .min(1, "Option 1 is shorter than 1 character")
    .required("Enter the option 1"),
  option2: yup
    .string()
    .trim()
    .max(150, "Option 2 is longer than 150 characters")
    .min(1, "Option 2 is shorter than 1 character")
    .required("Enter the option 2"),
  option3: yup
    .string()
    .trim()
    .max(150, "Option 3 is longer than 150 characters")
    .min(1, "Option 3 is shorter than 1 character")
    .required("Enter the option 3"),
  option4: yup
    .string()
    .trim()
    .max(150, "Option 4 is longer than 150 characters")
    .min(1, "Option 4 is shorter than 1 character")
    .required("Enter the option 4"),
  topicId: yup.number().required("Enter the topic"),
});

interface IFormInputs {
  text: string;
  answer: string;
  topicId: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}
interface Props {
  accessToken: string;
  setOpenPopup: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  callBack: ICallback;
  lightTopics: ITopicName[];
}
interface ICallback {
  (): void;
}

export const CreateQuestionForm: FC<Props> = ({
  accessToken,
  setOpenPopup,
  loading,
  callBack,
  lightTopics,
}) => {
  const classes = useStyles();

  const [selectedOption, setSelectedOption] = useState<string>("");

  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    setError,
    getValues,
  } = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: IFormInputs) {
    const result: IServerCreateQuestionError | null = await createNewQuestion(
      data,
      accessToken
    );
    if (result) {
      setError(result.name, { type: result.type, message: result.message });
    } else {
      callBack();
      setOpenPopup(false);
    }
  }

  function setTopicId(newValue: ITopicName | null): void {
    if (newValue) {
      setValue("topicId", newValue.id);
    }
  }
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    optionNumber: 1 | 2 | 3 | 4
  ) => {
    switch (optionNumber) {
      case 1:
        setSelectedOption(getValues("option1"));
        break;
      case 2:
        setSelectedOption(getValues("option2"));
        break;
      case 3:
        setSelectedOption(getValues("option3"));
        break;
      default:
        setSelectedOption(getValues("option4"));
        break;
    }
  };

  useEffect(() => {
    setValue("answer", selectedOption);
  }, [selectedOption, setValue]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="New question" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
            alignItems="center"
            justify="space-between"
            direction="column"
            className={classes.container}
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="text"
                  render={() => (
                    <TextField
                      autoFocus
                      variant="outlined"
                      id="text"
                      label="Question"
                      {...register("text", { required: true })}
                      error={!!errors.text}
                      helperText={errors?.text?.message}
                      onChange={(e) => setValue("text", e.target.value)}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="topicId"
                  render={() => (
                    <Autocomplete
                      id="topicsAutocomplete"
                      options={lightTopics}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      loading={loading}
                      onChange={(_e, newValue: ITopicName | null) =>
                        setTopicId(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          id="topicId"
                          label="Topic"
                          {...register("topicId", { required: true })}
                          error={!!errors.topicId}
                          helperText={errors?.topicId?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" className={classes.firstOptions}>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="option1"
                  render={() => (
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="center"
                    >
                      <TextField
                        variant="outlined"
                        id="option1"
                        label="Option 1"
                        {...register("option1", { required: true })}
                        error={!!errors.option1}
                        helperText={errors?.option1?.message}
                        onChange={(e) => {
                          setValue("option1", e.target.value);
                        }}
                      />
                      <Radio
                        disabled={!getValues("option1")}
                        checked={getValues("option1") === selectedOption}
                        onChange={(e) => handleChange(e, 1)}
                      />
                    </Grid>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="option2"
                  render={() => (
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="center"
                    >
                      <TextField
                        variant="outlined"
                        id="option2"
                        label="Option 2"
                        {...register("option2", { required: true })}
                        error={!!errors.option2}
                        helperText={errors?.option2?.message}
                        onChange={(e) => {
                          setValue("option2", e.target.value);
                        }}
                      />
                      <Radio
                        disabled={!getValues("option2")}
                        checked={getValues("option2") === selectedOption}
                        onChange={(e) => handleChange(e, 2)}
                      />
                    </Grid>
                  )}
                />
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="option3"
                  render={() => (
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="center"
                    >
                      <TextField
                        variant="outlined"
                        id="option3"
                        label="Option 3"
                        {...register("option3", { required: true })}
                        error={!!errors.option3}
                        helperText={errors?.option3?.message}
                        onChange={(e) => {
                          setValue("option3", e.target.value);
                        }}
                      />
                      <Radio
                        disabled={!getValues("option3")}
                        checked={getValues("option3") === selectedOption}
                        onChange={(e) => handleChange(e, 3)}
                      />
                    </Grid>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name="option4"
                  render={() => (
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="center"
                    >
                      <TextField
                        variant="outlined"
                        id="option4"
                        label="Option 4"
                        {...register("option4", { required: true })}
                        error={!!errors.option4}
                        helperText={errors?.option4?.message}
                        onChange={(e) => {
                          setValue("option4", e.target.value);
                        }}
                      />
                      <Radio
                        disabled={!getValues("option4")}
                        checked={getValues("option4") === selectedOption}
                        onChange={(e) => handleChange(e, 4)}
                      />
                    </Grid>
                  )}
                />
              </Grid>
            </Grid>
            <FormHelperText error={!!errors.answer}>
              {errors && errors.answer && errors?.answer.message}
            </FormHelperText>
          </Grid>
        </CardContent>
        <Divider />
        <Grid
          container
          direction="row"
          justify="flex-end"
          className={classes.buttons}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setOpenPopup(false)}
            disabled={loading}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
        </Grid>
      </Card>
    </form>
  );
};
