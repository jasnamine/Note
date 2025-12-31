import { Button, CircularProgress } from "@mui/material";

const ButtonSubmit = ({children, loading = false, disabled = false }) => {
    return (
      <Button
        type="submit"
        variant="contained"
        disabled={disabled || loading}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : children}
      </Button>
    );
}

export default ButtonSubmit