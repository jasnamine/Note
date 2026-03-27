import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getCollabNotes, getNotes, getPinnedNotes } from "../../redux/api/note";
import { createTag, deleteTag, editTag } from "../../redux/api/tag";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
};

const LabelModal = ({ open, handleClose }) => {
  const [newTag, setNewTag] = useState("");
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.tag.listTags);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const { t } = useTranslation();

  const handleAddLabel = () => {
    if (newTag) {
      dispatch(createTag(newTag));
      setNewTag("");
    }
  };

  const handleAskDelete = (tag) => {
    setTagToDelete(tag);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (tagToDelete) {
      await dispatch(deleteTag(tagToDelete.id));
      await dispatch(getNotes());
      await dispatch(getCollabNotes());
      await dispatch(getPinnedNotes());
    }
    setOpenConfirm(false);
    setTagToDelete(null);
  };

  const handleEditLabel = (tag) => {
    setEditingIndex(tag.id);
    setEditingValue(tag.name);
  };

  const handleConfirmEdit = async () => {
    if (editingValue.trim()) {
      try {
        await dispatch(
          editTag({ tagId: editingIndex, tagName: editingValue })
        ).unwrap();
        setEditingIndex(null);
        setEditingValue("");
      } catch (err) {
        console.error("Edit failed", err);
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: 500 }}>{t("edit label")}</Typography>
          </Box>

          {/* Create new label */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TextField
              placeholder="Create new tag"
              variant="standard"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 14, ml: 1 },
              }}
            />
            <IconButton onClick={() => setNewTag("")}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleAddLabel}>
              <CheckIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Existing labels */}
          <List dense>
            {tags.map((tag) => (
              <ListItem
                key={tag.id}
                secondaryAction={
                  <>
                    {editingIndex === tag.id ? (
                      <IconButton onClick={handleConfirmEdit}>
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEditLabel(tag)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleAskDelete(tag)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              >
                <ListItemIcon>
                  <LabelOutlinedIcon fontSize="small" />
                </ListItemIcon>
                {editingIndex === tag.id ? (
                  <TextField
                    variant="standard"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontSize: 14 },
                    }}
                  />
                ) : (
                  <ListItemText
                    primary={tag?.name}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                )}
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          {/* Done Button */}
          <Box sx={{ textAlign: "right" }}>
            <Button onClick={handleClose} size="small">
              Done
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xóa nhãn?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Nhãn <b>"{tagToDelete?.name}"</b> sẽ bị xóa khỏi tất cả ghi chú đã
            gán.
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LabelModal;
