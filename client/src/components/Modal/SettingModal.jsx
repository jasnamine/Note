import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings } from "../../redux/api/user";

import { useTranslation } from "react-i18next";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SettingModal = ({ open, onClose }) => {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  useEffect(() => {
    if (open && user?.settings) {
      setLanguage(user.settings.language || "en");
      setTheme(user.settings.theme || "light");
    }
  }, [open, user]);

  const handleSaveSettings = () => {
    dispatch(updateSettings({ language, theme }))
      .unwrap()
      .then(() => onClose())
      .catch((err) => {
        console.error("Failed to update settings:", err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {t("settings")}
        </Typography>

        <FormControl fullWidth sx={{ my: 2 }}>
          <FormLabel>{t("language")}</FormLabel>
          <RadioGroup
            row
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <FormControlLabel
              value="en"
              control={<Radio />}
              label={t("english")}
            />
            <FormControlLabel
              value="vi"
              control={<Radio />}
              label={t("vietnamese")}
            />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth sx={{ my: 2 }}>
          <FormLabel>{t("theme")}</FormLabel>
          <RadioGroup
            row
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <FormControlLabel
              value="light"
              control={<Radio />}
              label={t("light")}
            />
            <FormControlLabel
              value="dark"
              control={<Radio />}
              label={t("dark")}
            />
          </RadioGroup>
        </FormControl>
        <Box>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            color="primary"
            sx={{ mt: 2, float: "right" }}
          >
            {t("save")}
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            color="primary"
            sx={{ mt: 2, mr: 2, float: "right" }}
          >
            {t("cancel")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingModal;
