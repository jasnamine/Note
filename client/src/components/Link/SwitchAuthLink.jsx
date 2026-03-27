import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const SwitchAuthLink = ({ linkText, linkTo, question, align = "center" }) => {
  return (
    <Box textAlign={align}>
      <Typography variant="caption">
        {question}{" "}
        <Link
          component={RouterLink}
          to={linkTo}
          sx={{
            color: "primary.main",
            fontWeight: 500,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {linkText}
        </Link>
      </Typography>
    </Box>
  );
};

export default SwitchAuthLink;
