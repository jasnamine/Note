import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import logo from "../../../assets/images/logo.png";
const LogoSection = ({ handleDrawerToggle, pathName }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleDrawerToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!pathName && (
            <img src={logo} alt="logo" style={{ width: 30, margin: "10px" }} />
          )}
          <Typography variant="h6" noWrap>
            {pathName || "NoteSpace"}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(LogoSection);
