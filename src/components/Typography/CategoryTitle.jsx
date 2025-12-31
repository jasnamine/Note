import { Typography } from "@mui/material";
const CategoryTitle = ({ children }) => {
  return (
    <Typography
      sx={{
        color: "rgb(95, 99, 104)",
        lineHeight: "1rem",
        fontWeight: 600,
        fontSize: ".6rem",
        letterSpacing: ".07em",
        textTransform: "uppercase",
        position: "absolute",
        margin: 1,
      }}
    >
      {children}
    </Typography>
  );
};

export default CategoryTitle;
