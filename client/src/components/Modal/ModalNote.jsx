import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { editNote } from "../../redux/api/note";
import FormCheckboxNote from "../Notes/FormCheckboxNote";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
  outline: "none",
};

function ModalNote({ open, handleClose, note, permission }) {
  const isReadOnly = note?.deletedAt || permission == "view";
  const isVisible = !note?.deletedAt && permission !== "view";
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      checklistItems: note?.checklistItems || [
        { id: "", title: "", isDone: false },
      ],
    },
  });

  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    if (note) {
      reset({
        title: note.title || "",
        content: note.content || "",
        checklistItems: note.checklists || [
          { id: "", title: "", isDone: false },
        ],
      });
    }
  }, [note, reset]);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [showChecklist, setShowChecklist] = useState(false);
  const handleShowCheckList = () => {
    setShowChecklist(!showChecklist);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      const validChecklistItems =
        data.checklistItems?.filter(
          (item) => item.title && item.title.trim() !== ""
        ) || [];

      const submitData = {
        ...data,
        checklistItems:
          validChecklistItems.length > 0
            ? validChecklistItems.map((item) => ({
                id: item.id ? Number(item.id) : undefined,
                title: item.title || "",
                isDone: item.isDone || false,
              }))
            : [],
        noteId: note.id,
      };
      dispatch(editNote(submitData));
    } catch (error) {
      console.error("Error saving note:", error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="standard"
                placeholder={t("title")}
                disabled={isReadOnly}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: "1.25rem",
                    fontWeight: 500,
                  },
                }}
              />
            )}
          />

          {isVisible && (
            <>
              <Tooltip title={t("more")}>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                {showChecklist || note?.checklists?.length > 0 ? (
                  <MenuItem
                    onClick={() => {
                      handleShowCheckList();
                      handleMenuClose();
                    }}
                  >
                    {t("hide checkboxes")}
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      handleShowCheckList();
                      handleMenuClose();
                    }}
                  >
                    {t("show checkboxes")}
                  </MenuItem>
                )}

                <MenuItem onClick={handleMenuClose}>{t("version history")}</MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Content */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              fullWidth
              disabled={isReadOnly}
              variant="standard"
              placeholder="Take a note..."
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "0.95rem",
                },
              }}
            />
          )}
        />

        {/* Checklist */}
        {(showChecklist || note?.checklists?.length > 0) && (
          <FormCheckboxNote
            control={control}
            note={note}
            permission={permission}
          />
        )}

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          {isVisible && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              sx={{ mr: 1 }}
              onClick={handleSubmit(handleFormSubmit)}
            >
              {t("save")}
            </Button>
          )}

          <Button variant="outlined" size="small" onClick={handleClose}>
            {t("close")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalNote;
