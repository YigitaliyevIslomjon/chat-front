import React, { useState } from "react";
import { Avatar, Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";

type SignInFormValues = {
  user_name: string;
};

function SignIn() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormValues>();

  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const notify = (message: string) => toast(message);
  const navigate = useNavigate();

  const signInUser = (body: SignInFormValues) => {
    setLoadingButton(true);
    api
      .post("/user/login", body)
      .then((res) => {
        console.log("res", res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("access_token", res.data.token);
        navigate("/");
      })
      .catch((err) => {
        notify(err.response.data.error);
      })
      .finally(() => {
        setLoadingButton(false);
      });
  };
  const submitSignInForm = (data: SignInFormValues) => {
    signInUser(data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Box sx={{ maxWidth: "350px" }} className="flex flex-col items-center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitSignInForm)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            control={control}
            name="user_name"
            rules={{ required: "name is required" }}
            render={({ field: { onChange } }) => (
              <TextField
                onChange={onChange}
                margin="normal"
                fullWidth
                label="Name"
                autoComplete="name"
                error={errors.user_name ? true : false}
                helperText={errors.user_name && errors.user_name.message}
                autoFocus
              />
            )}
          />
          <LoadingButton
            type="submit"
            loading={loadingButton}
            loadingPosition="start"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            fullWidth
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              Don't have an account ?
            </Grid>
            <Grid item>
              <Link to="/sign-up" className="no-underline">
                {" "}
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ToastContainer />
    </div>
  );
}

export default SignIn;
