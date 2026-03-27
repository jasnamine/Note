import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import Navbar from "../../components/Header/Navbar/Navbar";
import Sidebar from "../../components/Header/Sidebar/Sidebar";
import VersionHistoryModal from "../../components/Modal/VersionHistoryModal";
import Form from "../../components/Notes/Form";
import Notes from "../../components/Notes/Notes";

function Home() {
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
        <Form />
        <VersionHistoryModal />

        <Notes typeNote={"listNotes"} />
      </Box>
    </Box>
  );
}

export default Home;
