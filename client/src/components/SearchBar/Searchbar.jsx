import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCollabNotes,
  getNotes,
  getPinnedNotes,
  searchNote,
} from "../../redux/api/note";

function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClear = () => {
    setSearchText("");
    dispatch(getNotes());

    dispatch(getPinnedNotes());

    dispatch(getCollabNotes());
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchText.trim()) {
      dispatch(searchNote({ keyword: searchText }));
    } else {
      dispatch(getNotes());
    }
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Paper
      onSubmit={handleSearch}
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "50%",
        height: 40,
        backgroundColor: isFocused
          ? isDarkMode
            ? theme.palette.background.paper
            : "#ffffff"
          : isDarkMode
            ? theme.palette.action.hover
            : "#f1f3f4",
        transition: "all 0.2s ease",
        boxShadow: isFocused
          ? isDarkMode
            ? theme.shadows[4]
            : "0 2px 6px rgba(0, 0, 0, 0.15)"
          : "none",
        color: theme.palette.text.primary,
      }}
    >
      <IconButton onClick={handleSearch} sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        inputProps={{
          "aria-label": "search",
          style: {
            color: theme.palette.text.primary,
          },
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {searchText && (
        <IconButton sx={{ p: "10px" }} onClick={handleClear} aria-label="clear">
          <CloseIcon />
        </IconButton>
      )}
    </Paper>
  );
}

export default SearchBar;
