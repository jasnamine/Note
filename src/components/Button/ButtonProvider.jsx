import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

function ButtonProvider({ provider, onClick }) {
  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon htmlColor="#DB4437" sx={{ fontSize: 20 }} />}
      onClick={() => onClick(provider)}
      sx={{ textTransform: "none", fontWeight: 500 }}
    >
      Sign in with {provider.name}
    </Button>
  );
}

export default ButtonProvider;
