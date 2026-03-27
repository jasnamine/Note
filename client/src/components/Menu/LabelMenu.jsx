import { Search } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  InputBase,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTagToNote, removeTagNote } from "../../redux/api/tagNote";
import { useTranslation } from "react-i18next";



function LabelMenu({
  anchorEl,
  onClose,
  tags,
  noteId,
  selectedTags,
  isNewNote,
  setTempTags,
}) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
    const { t } = useTranslation();

  const handleTagToggle = (tagId) => {

    const isSelected = selectedTags.includes(tagId);
    if (isSelected) {
      if (isNewNote) {
        setTempTags((prev) => prev.filter((t) => t.id !== tagId));
      } else if (noteId) {
        dispatch(removeTagNote({ noteId, tagId }));
      }
    } else {
      if (isNewNote) {
        const tag = tags.find((t) => t.id === tagId);
        if (tag && !selectedTags.includes(tagId)) {
          setTempTags((prev) => [...prev, { id: tag.id, name: tag.name }]);
        }
      } else if (noteId) {
        dispatch(addTagToNote({ noteId, tagId }));
      }
    }

  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ px: 2, pt: 1 }} gutterBottom>
        {t("labels")}
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        sx={{
          border: "none",
          borderRadius: 1,
          mx: 2,
        }}
      >
        <InputBase
          placeholder="Enter label name"
          autoFocus
          value={searchTerm}
          size="small"
          sx={{
            fontSize: "12px",
            color: "rgb(60,64,67)",
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton size="small">
          <Search fontSize="small" />
        </IconButton>
      </Box>

      <Box>
        {filteredTags.map((tag) => (
          <MenuItem
            key={tag.id}
            sx={{
              py: 0.5,
              px: 1,
              height: "32px",
            }}
            onClick={() => handleTagToggle(tag.id)}
          >
            <Checkbox
              size="small"
              color="rgba(103, 105, 107, 1)"
              checked={selectedTags.includes(tag.id)}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: "12px" }}
              primary={tag.name}
            />
          </MenuItem>
        ))}
      </Box>
    </Box>
  );
}

export default LabelMenu;
