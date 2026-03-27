import { Typography } from "@mui/material";
const AuthTitle = ({ children }) => {
  return (
    <Typography
      variant="h4"
      component="h1"
      sx={{ fontWeight: 600, textAlign: "center", mb: 3 }}
    >
      {children}
    </Typography>
  );
};

export default AuthTitle;
