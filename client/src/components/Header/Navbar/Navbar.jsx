import { AppBar, Box, Toolbar } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import ProfileMenu from "../../Menu/ProfileMenu";
import ProfileModal from "../../Modal/ProfileModal";
import SettingModal from "../../Modal/SettingModal";
import SearchBar from "../../SearchBar/Searchbar";
import LogoSection from "./LogoSection";

function Navbar({ handleDrawerToggle }) {
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const location = useLocation();
  const rawPath = capitalize(location.pathname.substring(1));
  const decodedPath = decodeURIComponent(rawPath);

  const pathName = capitalize(decodedPath);

  const [uiState, setUiState] = useState({
    anchorElUser: null,
    anchorNotify: null,
    openProfile: false,
    openSetting: false,
  });

  const handleOpenUserMenu = (e) =>
    setUiState((prev) => ({ ...prev, anchorElUser: e.currentTarget }));
  const handleCloseUserMenu = () =>
    setUiState((prev) => ({ ...prev, anchorElUser: null }));

  const setOpenProfile = (open) =>
    setUiState((prev) => ({ ...prev, openProfile: open }));
  const setOpenSetting = (open) =>
    setUiState((prev) => ({ ...prev, openSetting: open }));

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        color: "text.primary",
        fontWeight: 500,
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>

        <LogoSection
          pathName={pathName}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <SearchBar />
        </Box>

        <Box>
          <ProfileMenu
            anchorElUser={uiState.anchorElUser}
            handleOpenUserMenu={handleOpenUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
            setOpenProfile={setOpenProfile}
            setOpenSetting={setOpenSetting}
          />
        </Box>
      </Toolbar>
      <ProfileModal
        open={uiState.openProfile}
        onClose={() => setOpenProfile(false)}
      />
      <SettingModal
        open={uiState.openSetting}
        onClose={() => setOpenSetting(false)}
      />
    </AppBar>
  );
}

export default Navbar;
