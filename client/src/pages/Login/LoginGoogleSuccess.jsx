import { Box, Typography } from "@mui/material";
import { Navigate, useSearchParams } from "react-router-dom";

const LoginGoogleSuccess = () => {
  const [searchParams] = useSearchParams();

  const accessToken = searchParams.get("accessToken");

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box>
      <Typography>Đang đăng nhập bằng Google…</Typography>
    </Box>
  );
};

export default LoginGoogleSuccess;
