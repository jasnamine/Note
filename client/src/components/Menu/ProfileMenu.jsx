import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/api/auth";
import { getUser } from "../../redux/api/user";
import { persistor, resetStore } from "../../redux/store";
import { getInitialsFullname } from "../../utils/helpers";
import { setAccessToken } from "../../redux/api/axiosWrapper";
import { useTranslation } from "react-i18next";

const ProfileMenu = ({
  handleOpenUserMenu,
  anchorElUser,
  handleCloseUserMenu,
  setOpenProfile,
  setOpenSetting,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.userData);
  const userGoogleLogin = useSelector((state) => state.auth?.googleLogin?.msg);

   const { t, i18n } = useTranslation();

const handleLogout = async () => {
  try {
    await dispatch(logout()).unwrap();

    setAccessToken(null);

    localStorage.clear();

    dispatch(resetStore());

    await persistor.purge();

  } catch (err) {
    console.error("Logout failed:", err);
  }
};


  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <>
      <Tooltip title={t("my account")}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          {user?.avatar && <Avatar src={user?.avatar} />}

          {!user?.avatar && userGoogleLogin?.fullname && (
            <Avatar>{getInitialsFullname(userGoogleLogin?.fullname)}</Avatar>
          )}

          {!user?.avatar && user.fullname && (
            <Avatar>{getInitialsFullname(user?.fullname)}</Avatar>
          )}
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "20px" }}
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          onClick={() => {
            setOpenProfile(true);
            handleCloseUserMenu();
          }}
        >
          <Typography textAlign="center">{t("profile")}</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenSetting(true);
            handleCloseUserMenu();
          }}
        >
          <Typography textAlign="center">{t("settings")}</Typography>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <Typography textAlign="center">{t("logout")}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
