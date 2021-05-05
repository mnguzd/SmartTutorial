import moment from "moment";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Avatar,
  CardActions,
  Button,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IUser } from "../../auth/Auth";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const useStyles = makeStyles((theme) => ({
  box: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    height: 100,
    width: 100,
  },
}));

const schema = yup.object().shape({
  file: yup
    .mixed()
    .required("You have to provide a file")
    .test("size", "The file weights more than 2 MB.", (value) => {
      console.log(value);
      return value && value[0].size <= 200;
    }),
});

export interface IFormInputs {
  file: File;
}

export default function AccountProfile(user: IUser) {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IFormInputs>({ resolver: yupResolver(schema) });

  async function onSubmit(data: File): Promise<void> {
    console.log(data);
  }
  async function onChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    await onSubmit(input.files[0]);
  }
  return (
    <Card {...user}>
      <CardContent>
        <Box className={classes.box}>
          <Avatar src={user.avatar} className={classes.avatar} />
          <Typography color="textPrimary" gutterBottom variant="h6">
            {user.firstname + " " + user.lastname}
          </Typography>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {"Rating: " + user.rating}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {user?.country}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {moment().format("hh:mm A")}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Button color="primary" component="label" fullWidth variant="text">
            Upload picture
            <Controller
              control={control}
              name="file"
              render={() => (
                <input
                  type="file"
                  id="file"
                  {...register("file", { required: true })}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  hidden
                />
              )}
            />
          </Button>
          {Boolean(errors.file) && (
            <FormHelperText error>
              {(errors.file as any)?.message}
            </FormHelperText>
          )}
        </form>
      </CardActions>
    </Card>
  );
}
