import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const VerifyOTP = () => {
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
          Verify OTP
        </Typography>

        <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
          Please enter the 6-digit code sent to your email.
        </Typography>

        <form noValidate>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="OTP Code"
              variant="outlined"
              placeholder="Enter OTP"
              inputProps={{ maxLength: 6 }}
            />

            <Button type="submit" variant="contained" fullWidth>
              Verify
            </Button>
          </Stack>
        </form>
      </Paper>
    </Grid>
  );
};

export default VerifyOTP;
