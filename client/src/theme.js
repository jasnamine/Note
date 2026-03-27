import { createTheme } from "@mui/material/styles";

export const getMuiTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }
        : {}),
    },
  });
