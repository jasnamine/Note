import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Header/Navbar/Navbar";
import Sidebar from "../../components/Header/Sidebar/Sidebar";
import Form from "../../components/Notes/Form";
import Notes from "../../components/Notes/Notes";

const NotesByTag = () => {
  const { tagName } = useParams();
  const tags = useSelector((state) => state.tag?.listTags);
  const tagId = tags.find((tag) => tag.name == tagName)?.id;
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

        <Notes typeNote={"listNotesByTag"} tagCategory={tagId} />
      </Box>
    </Box>
  );
};

export default NotesByTag;
