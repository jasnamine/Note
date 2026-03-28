import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import InputField from "../../components/Input/InputField";
import { resetPassword } from "../../redux/api/auth";
import { pawdRegExp } from "../../utils/regex";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success, loading, msg } = useSelector(
    (state) => state.auth.resetPassword,
  );

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const schema = yup.object({
    newPassword: yup
      .string()
      .required("Password is required")
      .matches(
        pawdRegExp,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (!token) return;

    const { confirmPassword, ...rest } = data;
    dispatch(resetPassword({ token, newPassword: rest.newPassword }));
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [dispatch, navigate, success]);

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
          sx={{ fontWeight: 600, textAlign: "center", mb: 2 }}
        >
          Reset Password
        </Typography>

        <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
          Enter your new password below.
        </Typography>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <InputField
              id="newPassword"
              name="newPassword"
              label="New Password"
              required
              control={control}
              errors={errors}
              type="password"
              placeholder="Enter new password"
            />

            {error && <ErrorMessage message={msg} />}
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              required
              control={control}
              errors={errors}
              type="password"
              placeholder="Re-enter new password"
            />

            <ButtonSubmit loading={loading}>Submit</ButtonSubmit>
          </Stack>
        </form>
      </Paper>
    </Grid>
  );
};

export default ResetPassword;
