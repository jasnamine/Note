import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DatePicker,
  DesktopTimePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createReminder, editReminder } from "../../redux/api/remind";
import { formatDateForMySQL } from "../../utils/helpers";
import { useTranslation } from "react-i18next";

const ReminderModal = ({
  open,
  onClose,
  noteId,
  note,
  setTempReminders,
  initialReminder,
  isNewNote,
  isEdit,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [repeat, setRepeat] = useState("none");
  const { t } = useTranslation();

  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open) {
      if (initialReminder) {
        const date = new Date(initialReminder.time);
        setSelectedDate(date);
        setSelectedTime(date);
        setRepeat(initialReminder.repeat);
      } else {
        // Reset về thời gian hiện tại khi tạo mới
        const now = new Date();
        setSelectedDate(now);
        setSelectedTime(now);
        setRepeat("none");
      }
    }
  }, [open, initialReminder]);

  const handleSave = () => {
    const mergedDateTime = new Date(selectedDate);
    mergedDateTime.setHours(selectedTime.getHours());
    mergedDateTime.setMinutes(selectedTime.getMinutes());
    mergedDateTime.setSeconds(0);
    mergedDateTime.setMilliseconds(0);

    const formattedTime = formatDateForMySQL(mergedDateTime);
    if (isNewNote) {
      if (isEdit) {
        setTempReminders((prev) =>
          prev.map((reminder) =>
            reminder.id === initialReminder.id
              ? {
                  ...reminder,
                  time: formattedTime,
                  repeat,
                }
              : reminder
          )
        );
      } else {
        setTempReminders((prev) => [
          ...prev,
          { id: Date.now(), time: formattedTime, repeat },
        ]);
      }
    }

    if (!isNewNote) {
      if (isEdit) {
        dispatch(
          editReminder({ id: initialReminder.id, noteId, time: formattedTime, repeat })
        );
      } else {
        dispatch(createReminder({ noteId, time: formattedTime, repeat }));
      }
    }
    onClose();
  };

  return (
    <Dialog
      onClick={(e) => e.stopPropagation()}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        {" "}
        {isEdit ? t("edit date and time") : t("pickDateTime")}
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={t("pick a date")}
            value={selectedDate}
            minDate={new Date()}
            onChange={(newDate) => setSelectedDate(newDate)}
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />

          {/* Responsive */}
          {isMobile ? (
            <MobileTimePicker
              label={t("pick a time")}
              value={selectedTime}
              onChange={(newTime) => setSelectedTime(newTime)}
              ampm
              minutesStep={5}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
          ) : (
            <DesktopTimePicker
              label={t("pick a time")}
              disablePast
              value={selectedTime}
              onChange={(newTime) => setSelectedTime(newTime)}
              ampm
              minutesStep={5}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
          )}
        </LocalizationProvider>

        <FormControl fullWidth margin="normal">
          <Select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
            <MenuItem value="none">{t("does not repeat")}</MenuItem>
            <MenuItem value="daily">{t("daily")}</MenuItem>
            <MenuItem value="weekly">{t("weekly")}</MenuItem>
            <MenuItem value="monthly">{t("monthly")}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        {!note?.deletedAt && (
          <Button onClick={handleSave} variant="contained">
            {t("save")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReminderModal;
