import CheckIcon from "@mui/icons-material/Check";
import { Avatar, Box, Divider, IconButton, Menu, Tooltip } from "@mui/material";

import { colors, themes } from "../../utils/staticData.jsx";
import { useSelector } from "react-redux";

const ColorThemePicker = ({
  anchorEl,
  onClose,
  onSelectColor,
  onSelectTheme,
  selectedColor,
  selectedTheme,

}) => {
  const open = Boolean(anchorEl);
  const setting = useSelector((state) => state.user?.userData?.settings);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", px: 1 }}>
        {colors.map((item, index) => (
          <Tooltip title={item.name} key={index}>
            <IconButton
              onClick={() => {
                onSelectColor(item.name);
                onClose();
              }}
              sx={{
                width: 32,
                height: 32,
                m: 0.5,
                bgcolor: setting?.theme === "light" ? item.value : item.dark,
                border: "1px solid #ccc",
                "&:hover": {
                  border:
                    setting?.theme === "light"
                      ? "2px solid #ffffff"
                      : "2px solid #0d0c0cff",
                },
                position: "relative",
              }}
            >
              {item.icon}
              {selectedColor === item.name && (
                <CheckIcon
                  sx={{
                    color: "#fff",
                    fontSize: 18,
                    position: "absolute",
                    top: -4,
                    right: -4,
                    bgcolor: "rgb(161, 66, 244)",
                    borderRadius: "50%",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ height: 10 }} />
      <Divider />

      <Box sx={{ display: "flex", flexWrap: "wrap", px: 1, pt: 1 }}>
        {themes.map((item, index) => (
          <Tooltip title={item.name} key={index}>
            <Box
              onClick={() => {
                onSelectTheme(item.name);
                onClose();
              }}
              sx={{
                width: 32,
                height: 32,
                m: 1,
                borderRadius: "50%",
                border: "1px solid #ccc",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { cursor: "pointer" },
              }}
            >
              {item.type === "image" ? (
                <Avatar
                  src={setting?.theme === "light" ? item.value : item.dark}
                  alt={item.name}
                  sx={{ width: "100%", height: "100%" }}
                />
              ) : (
                item.icon
              )}
              {selectedTheme === item.name && (
                <CheckIcon
                  sx={{
                    color: "#fff",
                    fontSize: 18,
                    position: "absolute",
                    top: -4,
                    right: -4,
                    bgcolor: "rgb(161, 66, 244)",
                    borderRadius: "50%",
                  }}
                />
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Menu>
  );
};

export default ColorThemePicker;
