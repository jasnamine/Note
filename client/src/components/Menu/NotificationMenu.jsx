import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { acceptInvitation } from "../../redux/api/collab";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
} from "../../redux/api/notify";

const NotificationMenu = ({ anchorEl, onOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.notify?.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleBellClick = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  };

  useEffect(() => {
    if (anchorEl) {
      dispatch(getNotifications());
    }
  }, [anchorEl]);

  const handleAcceptInvitation = (notify) => {
    dispatch(
      acceptInvitation({
        invitationId: notify.data.invitationId,
        inviterId: notify.data.inviterId,
        status: "accepted",
      })
    ).catch((err) => {
      console.error("Accept invitation failed:", err);
    });
  };

  const handleDeleteInvitation = (notify) => {
    if (notify.type === "collaborator_accepted") {
      return dispatch(deleteNotification({ notificationId: notify.id }));
    }

    dispatch(deleteNotification({ notificationId: notify.id }));
  };

  return (
    <>
      {/* Icon thông báo */}
      <Tooltip title={t("notifications")}>
        <IconButton
          size="large"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={(e) => {
            onOpen(e);
            handleBellClick();
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Popup menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          sx: {
            maxWidth: "400px",
            overflow: "hidden",
          },
        }}
      >
        {notifications.length === 0 ? (
          <Typography variant="body2" sx={{ p: 1, textAlign: "center" }}>
            {t("empty notifications")}
          </Typography>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                py: 1.5,
                borderBottom: "1px solid #eee",
                whiteSpace: "normal",
              }}
            >
              <Box display="flex" gap="2">
                <Avatar
                  src={n.data.avatarUrl || ""}
                  alt={n.data.inviterEmail}
                  sx={{ mr: 1 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {n.type === "collaborator_accepted" ? (
                    <>
                      <strong>{n.data.collaboratorEmail}</strong>{" "}
                      {t("has accepted your invitation")}
                    </>
                  ) : (
                    <>
                      <strong>{n.data.inviterEmail}</strong>{" "}
                      {t("invited you to collaborate on")}
                      <em>{n.data.noteTitle}</em>
                    </>
                  )}
                </Typography>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, ml: "80%" }}
              >
                {new Date(n.createdAt).toLocaleDateString()}
              </Typography>

              {/* Chỉ hiển thị nút khi không phải collaborator_accepted */}

              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                {n.type !== "collaborator_accepted" && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      fontSize: "0.7rem",
                      padding: "2px 6px",
                      minWidth: "unset",
                      textTransform: "none",
                    }}
                    onClick={() => handleAcceptInvitation(n)}
                  >
                    {t("accept")}
                  </Button>
                )}
                <Button
                  variant={
                    n.type === "collaborator_accepted"
                      ? "contained"
                      : "outlined"
                  }
                  color={
                    n.type === "collaborator_accepted" ? "primary" : "inherit"
                  }
                  sx={{
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    minWidth: "unset",
                    textTransform: "none",
                  }}
                  onClick={() => handleDeleteInvitation(n)}
                >
                  {t("delete")}
                </Button>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
