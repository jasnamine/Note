import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ReminderModal from "../Modal/ReminderModal";
import { useTranslation } from "react-i18next";

const ReminderMenu = ({
  anchorEl,
  onClose,
  noteId,
  note,
  setTempReminders,
  isNewNote,
  openReminderModal,
  setOpenReminderModal,
  setReminderToEdit,
  reminderToEdit,
  isEdit,
}) => {
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const { t } = useTranslation();

  const handlePickDateTime = () => {
    setOpenDialog(true);
    onClose();
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Typography
          variant="subtitle2"
          sx={{ px: 2, pt: 0.5, color: "rgb(32,33,36)" }}
          gutterBottom
        >
          {t("reminder")}
        </Typography>
        <Divider />

        <Divider />

        <MenuItem onClick={handlePickDateTime}>
          <AccessTimeIcon sx={{ fontSize: 14, mr: 1 }} />
          <ListItemText
            primary={t("pickDateTime")}
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </MenuItem>
      </Menu>

      <ReminderModal
        noteId={noteId}
        open={openDialog}
        note={note}
        isNewNote={isNewNote}
        setTempReminders={setTempReminders}
        openReminderModal={openReminderModal}
        setOpenReminderModal={setOpenReminderModal}
        setReminderToEdit={setReminderToEdit}
        reminderToEdit={reminderToEdit}
        isEdit={isEdit}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
};

export default ReminderMenu;
