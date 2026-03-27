import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Divider,
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
import ButtonProvider from "../../components/Button/ButtonProvider";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import ErrorMessage from "../../components/Input/ErrorMessage";
import InputField from "../../components/Input/InputField";
import SwitchAuthLink from "../../components/Link/SwitchAuthLink";
import AuthTitle from "../../components/Typography/AuthTitle";
import { login } from "../../redux/api/auth";
import { pawdRegExp } from "../../utils/regex";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const schema = yup.object({
    username: yup.string().required("Username is required").min(3),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        pawdRegExp,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.login);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    let timer;
    if (user?.success && user?.token) {
      timer = setTimeout(() => {
        navigate("/");
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [user?.success, user?.token, navigate]);

  const googleProvider = { id: "google", name: "Google" };

  const handleProviderLogin = (provider) => {
    if (provider.id === "google") {
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/api/v1/auth/google`;
    }
  };

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
        <AuthTitle> Log in</AuthTitle>

        <ButtonProvider
          provider={googleProvider}
          onClick={handleProviderLogin}
        />

        <Divider sx={{ my: 3 }}>Or login with your account</Divider>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          {user?.error && user?.msg.includes("locked") && (
            <ErrorMessage message={user?.msg} />
          )}

          <Stack spacing={1}>
            <InputField
              id="username"
              name="username"
              label="Username"
              control={control}
              errors={errors}
              required
              placeholder="Enter username"
            />

            {user?.error && user?.msg.includes("User") && (
              <ErrorMessage message={user?.msg} />
            )}

            <InputField
              id="password"
              name="password"
              label="Password"
              control={control}
              errors={errors}
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

            <SwitchAuthLink
              linkTo="/forgot-password"
              linkText="Forgot password"
              align="start"
            />

            {user?.error && user?.msg.includes("password") && (
              <ErrorMessage message={user?.msg} />
            )}

            <ButtonSubmit loading={user?.loading}>Login</ButtonSubmit>

            <SwitchAuthLink
              linkTo="/register"
              linkText="Register"
              question="Don’t have an account?"
            />

            <Snackbar open={user?.success} autoHideDuration={1500}>
              <Alert severity="success">Login successful!</Alert>
            </Snackbar>
          </Stack>
        </form>
      </Paper>
    </Grid>
  );
};

export default Login;
