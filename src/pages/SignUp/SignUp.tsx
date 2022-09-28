import Avatar from "@mui/material/Avatar";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import api from "../../utils/api";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type SignUpFormValues = {
  user_name: string;
};

function SignUp() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const navigate = useNavigate();

  const notify = (message: string) => toast(message);

  const createUserApi = (body: SignUpFormValues) => {
    setLoadingButton(true);
    api
      .post("/user/sign-up", body)
      .then((res) => {
        navigate("/sign-in");
      })
      .catch((err) => {
        notify(err.response.data.error);
      })
      .finally(() => {
        setLoadingButton(false);
      });
  };

  const submitSignUpForm = (data: SignUpFormValues) => {
    createUserApi(data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Box sx={{ maxWidth: "400px" }} className="flex flex-col items-center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitSignUpForm)}
          noValidate
          sx={{ mt: 3 }}
        >
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="user_name"
                rules={{ required: "name is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={errors.user_name && errors.user_name.message}
                    label="user_name"
                    error={errors.user_name ? true : false}
                  />
                )}
              />
            </Grid>{" "}
          </Grid>
          <LoadingButton
            type="submit"
            loading={loadingButton}
            loadingPosition="start"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            fullWidth
          >
            Sign Up
          </LoadingButton>
        </Box>
      </Box>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
