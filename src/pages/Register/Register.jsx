import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import ErrorMessage from "../../components/Input/ErrorMessage";
import InputField from "../../components/Input/InputField";
import SwitchAuthLink from "../../components/Link/SwitchAuthLink";
import AuthTitle from "../../components/Typography/AuthTitle";
import { register } from "../../redux/api/auth";
import { pawdRegExp } from "../../utils/regex";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, msg } = useSelector((state) => state.auth.register);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [showCfPassword, setShowCfPassword] = useState(false);
  const handleShowCfPassword = () => {
    setShowCfPassword(!showCfPassword);
  };

  const schema = yup.object({
    username: yup.string().required("Username is required").min(3),
    fullname: yup.string().required("Full Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        pawdRegExp,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { confirmPassword, ...submitData } = data;
    dispatch(register(submitData));
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
     
        navigate("/login");
      }, 1000);
    }
  }, [success, dispatch, navigate]);

  const paperStyle = {
    padding: 24,
    width: 320,
    margin: "40px auto",
  };

  const gridStyle = {
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  };

  return (
    <Grid container style={gridStyle}>
      <Paper elevation={3} style={paperStyle}>
        <AuthTitle>Register</AuthTitle>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <InputField
              id="username"
              name="username"
              control={control}
              errors={errors}
              label="Username"
              required
              placeholder="Enter username"
            />

            {error && msg.includes("Username") && (
              <ErrorMessage message={msg} />
            )}

            <InputField
              id="fullname"
              name="fullname"
              control={control}
              errors={errors}
              label="Fullname"
              required
              placeholder="Enter fullname"
            />

            <InputField
              id="email"
              name="email"
              control={control}
              errors={errors}
              label="Email"
              required
              placeholder="Enter email"
              type="email"
            />

            {error && msg.includes("Email") && <ErrorMessage message={msg} />}

            <InputField
              id="password"
              name="password"
              control={control}
              errors={errors}
              label="Password"
              required
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              inputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleShowPassword}
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <InputField
              id="confirmPassword"
              name="confirmPassword"
              control={control}
              errors={errors}
              label="Confirm Password"
              required
              placeholder="Re-enter Password"
              type={showCfPassword ? "text" : "password"}
              inputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleShowCfPassword}
                      aria-label={
                        showCfPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      edge="end"
                    >
                      {showCfPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <ButtonSubmit loading={loading}>Register</ButtonSubmit>

            <SwitchAuthLink
              linkTo="/login"
              linkText="Login"
              question="Already have an account?"
            />
          </Stack>
        </form>
      </Paper>

      <Snackbar open={success} autoHideDuration={1500}>
        <Alert severity="success">Registration successful!</Alert>
      </Snackbar>
    </Grid>
  );
};

export default Register;
