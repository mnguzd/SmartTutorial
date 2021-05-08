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
  Grid,
  Badge,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  uploadImage,
  IServerImageUploadError,
} from "../../services/api/AccountApi";
import { IUser, useAuth } from "../../auth/Auth";
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
  form: {
    width: "100%",
  },
}));

//front validations doesn`t work (don`t know why)
const schema = yup.object().shape({
  image: yup
    .mixed()
    .test("fileSize", "The file weights more than 2 MB.", (value) => {
      console.log(value);
      return value.size <= 200;
    }),
});

export interface IFormInputs {
  image: File;
}

export default function AccountProfile(user: IUser) {
  const { updateUserInfo } = useAuth();
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<IFormInputs>({ resolver: yupResolver(schema) });

  async function onSubmit(data: File): Promise<void> {
    const result: IServerImageUploadError | null = await uploadImage(data);
    if (result) {
      setError(result.name, { type: result.type, message: result.message });
    } else {
      await updateUserInfo();
    }
  }
  async function onChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    onSubmit(input.files[0]);
  }
  return (
    <Card {...user}>
      <CardContent>
        <Box className={classes.box}>
          <Badge
            badgeContent={user.rating}
            color="primary"
            overlap="circle"
            max={999}
          >
            <Avatar src={user.avatar} className={classes.avatar} />
          </Badge>
          <Typography color="textPrimary" gutterBottom variant="h6">
            {user.firstname + " " + user.lastname}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {user?.country + " " + moment().format("hh:mm A")}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
        >
          <Button color="primary" component="label" fullWidth variant="text">
            Upload picture
            <Controller
              control={control}
              name="image"
              render={() => (
                <input
                  type="file"
                  id="image"
                  {...register("image", { required: true })}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  hidden
                />
              )}
            />
          </Button>
          {Boolean(errors.image) && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item>
                <FormHelperText error>
                  {(errors.image as any)?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          )}
        </form>
      </CardActions>
    </Card>
  );
}
