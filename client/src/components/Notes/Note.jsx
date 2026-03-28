import CloseIcon from "@mui/icons-material/Close";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteImageNote } from "../../redux/api/imageNote";
import { pinNote } from "../../redux/api/note";
import { deleteReminder, editReminder } from "../../redux/api/remind.js";
import { removeTagNote } from "../../redux/api/tagNote";
import { formatDateForUser } from "../../utils/helpers.js";
import { colors, themes } from "../../utils/staticData.jsx";
import ButtonIcon from "../Button/ButtonIcon";
import ModalNote from "../Modal/ModalNote";
import ReminderModal from "../Modal/ReminderModal.jsx";
import { useTranslation } from "react-i18next";

function Note({
  note,
  images,
  title,
  content,
  isPinned,
  isArchived,
  checklists,
  tags,
  reminders,
  collaborators,
  owner,
  noteId,
  noteColor,
  noteTheme,
  permission,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
    setOpenImageModal(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setOpenImageModal(false);
    setSelectedImage(null);
  }, []);

  const [openReminderModal, setOpenReminderModal] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);

  const handleEditReminder = (reminder) => {
    setReminderToEdit({
      id: reminder.id,
      noteId: reminder.noteId,
      time: reminder.time,
      repeat: reminder.repeat

    });
    setOpenReminderModal(true);
  };

  const [openModalNote, setOpenModalNote] = useState(false);

  const handleOpenModalNote = () => {
    setOpenModalNote(true);
  };
  const handleCloseModalNote = () => {
    setOpenModalNote(false);
  };

  const handlePinNote = useCallback(
    (isPinned) => {
      const pinned = {
        isPinned: !isPinned,
      };
      dispatch(pinNote({ noteId, isPinned: pinned.isPinned }));
    },
    [dispatch]
  );

  const handleDeleteImage = useCallback(
    (url) => {
      const image = images.find((img) => img.url === url);
      if (image) {
        dispatch(deleteImageNote({ noteId, imageUrl: image.url }));
      }
    },
    [dispatch, noteId]
  );

  const handleDeleteTag = useCallback(
    (tagId) => {
      dispatch(removeTagNote({ noteId, tagId }));
    },
    [dispatch, noteId]
  );

  const handleDeleteReminder = (reminder) => {
    dispatch(deleteReminder({ id: reminder.id, noteId }));
  };

  const color = colors.find((c) => c.name == noteColor);
  const theme = themes.find((t) => t.name == noteTheme);
  const setting = useSelector((state) => state.user?.userData?.settings?.theme);
  const getBackgroundImg = (theme) => {
    if (!theme?.value) {
      return "none";
    }
    if (setting === "light") {
      return `url(${theme?.value})`;
    }
    if (setting === "dark") {
      return `url(${theme?.dark})`;
    }
  };

  const getBackgroundColor = (color) => {
    if (setting === "light") {
      return color?.value;
    }
    if (setting === "dark") {
      return color?.dark;
    }
  };

  const style = {
    maxWidth: "270px",
    // minWidth: "260px",
    boxSizing: "border-box",
    borderColor: "#e0e0e0",
    border: "1px solid transparent",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      transform: "translateY(-2px)", // hiệu ứng nổi
    },
    p: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    display: "block",
    bgcolor: getBackgroundColor(color),
    backgroundImage: getBackgroundImg(theme),
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  };

  return (
    <>
      <Card sx={style} onClick={handleOpenModalNote}>
        {images && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 400,
              gap: "4px",
            }}
          >
            {images.map((img, index) => {
              const total = note?.images.filter((img) => img.url).length;
              const itemsInLastRow = total % 3;
              const lastRowStart = total - itemsInLastRow;

              let width = "32%";
              if (index >= lastRowStart) {
                if (itemsInLastRow === 1) width = "100%";
                else if (itemsInLastRow === 2) width = "49%";
              }

              return (
                <Box
                  key={index}
                  sx={{
                    width,
                    height: 100,
                    position: "relative",
                    borderRadius: 1,
                    overflow: "hidden",
                    "&:hover .delete-button": {
                      display: "block",
                    },
                  }}
                >
                  <img
                    src={img?.url}
                    alt={`preview-${img?.id}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(img?.url);
                    }}
                  />
                  {!note?.deletedAt && (
                    <IconButton
                      className="delete-button"
                      sx={{
                        display: "none",
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "white",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(img?.url);
                      }}
                    >
                      <CloseIcon size="small" />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        <CardContent
          sx={{
            p: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {title && (
              <Typography variant="subtitle1" fontWeight="bold">
                {title}
              </Typography>
            )}

            {!title && <Typography variant="subtitle1">{content}</Typography>}
            {!note?.deletedAt && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinNote(isPinned);
                }}
                sx={{
                  color: isPinned ? "primary.main" : "inherit",
                  float: "right",
                }}
              >
                {isPinned ? (
                  <PushPinIcon fontSize="small" />
                ) : (
                  <PushPinOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </Box>

          {title && (
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {content}
            </Typography>
          )}

          <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
            {checklists
              ?.filter((item) => !item.isDone)
              .map((item) => (
                <Box key={item.id} display="flex" alignItems="center">
                  <Checkbox checked={item.isDone} />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {item.title}
                  </Typography>
                </Box>
              ))}

            {checklists?.filter((item) => item.isDone).length > 0 && (
              <>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontWeight: 500, mt: 1 }}
                >
                  {checklists.filter((item) => item.isDone).length} {t("completed items")}
                </Typography>
                {checklists
                  ?.filter((item) => item.isDone)
                  .map((item) => (
                    <Box key={item.id} display="flex" alignItems="center">
                      <Checkbox
                        checked={item.isDone}
                        sx={{
                          "&.Mui-checked": {
                            color: "rgb(32,33,36)",
                          },
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                          flexGrow: 1,
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  ))}
              </>
            )}
          </Stack>
        </CardContent>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "flex-start",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {tags?.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              onDelete={
                owner != note?.userId || note?.deletedAt
                  ? undefined
                  : () => handleDeleteTag(tag.id)
              }
            />
          ))}
          {reminders?.map((reminder) => (
            <Chip
              key={reminder.id}
              label={formatDateForUser(reminder.time)}
              size="small"
              onClick={() => handleEditReminder(reminder)}
              onDelete={
                note?.deletedAt || permission == "view"
                  ? undefined
                  : () => handleDeleteReminder(reminder)
              }
            />
          ))}

          {owner && (
            <Tooltip title={`${owner?.username}( ${t("owner")} )`} placement="top">
              <Avatar
                src={owner?.avatar || undefined}
                sx={{ width: 24, height: 24 }}
              />
            </Tooltip>
          )}

          {collaborators?.map((collaborator) => (
            <Tooltip
              key={collaborator?.id}
              title={`${collaborator?.user?.username}`}
              placement="top"
            >
              <Avatar sx={{ width: 24, height: 24 }} />
            </Tooltip>
          ))}
        </div>

          <ButtonIcon
            noteId={noteId}
            isNewNote={false}
            isArchived={isArchived}
            note={note}
            permission={permission}
          />
   
        <ReminderModal
          open={openReminderModal}
          onClose={() => {
            setOpenReminderModal(false);
            setReminderToEdit(null);
          }}
          note={note}
          noteId={noteId}
          initialReminder={reminderToEdit}
          isEdit={!!reminderToEdit}
        />
      </Card>
      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="full-image"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              borderRadius: "50%",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
      <ModalNote
        open={openModalNote}
        handleClose={handleCloseModalNote}
        note={note}
        permission={permission}
      />
    </>
  );
}

export default memo(Note);
