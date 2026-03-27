import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import ErrorMessage from "../../components/Input/ErrorMessage";
import InputField from "../../components/Input/InputField";
import { forgotPassword } from "../../redux/api/auth";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(forgotPassword(data.email));
  };

  const { error, success, loading, msg } = useSelector(
    (state) => state.auth.forgotPassword
  );

  useEffect(() => {
    if (success) {
      setTimeout(() => {

        navigate("/reset-password");
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  const paperStyle = {
    padding: 24,
    width: 320,
    margin: "40px auto",
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} style={paperStyle}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 600, textAlign: "center", mb: 3 }}
        >
          Forgot Password
        </Typography>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
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
            {error && <ErrorMessage message={msg} />}

            <ButtonSubmit loading={loading}>Submit</ButtonSubmit>

            <Box textAlign="center">
              <Typography variant="caption">
                Back to{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Grid>
  );
};

export default ForgotPassword;
