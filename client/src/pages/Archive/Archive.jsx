import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import Navbar from "../../components/Header/Navbar/Navbar";
import Sidebar from "../../components/Header/Sidebar/Sidebar";
import Notes from "../../components/Notes/Notes";

function Archive() {
  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => setOpen((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CssBaseline />

      <Navbar open={open} handleDrawerToggle={handleDrawerToggle} />

      <Sidebar open={open} setOpen={setOpen} />

      <Box
        component="main"
        sx={{
          p: 3,
          mt: 8,
          width: "100%",
        }}
      >
        <Notes typeNote={"archivedNotes"} />
      </Box>
    </Box>
  );
}

export default Archive;
