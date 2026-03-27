import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
} from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadImageNote } from "../../redux/api/imageNote";
import {
  archivedNote,
  deleteNote,
  restoreNote,
  settingNote,
  softDeleteNote,
} from "../../redux/api/note";
import { getTagsNote } from "../../redux/api/tagNote";
import ColorThemePicker from "../Menu/ColorThemePicker";
import LabelMenu from "../Menu/LabelMenu";
import ReminderMenu from "../Menu/ReminderMenu";
import CollabModal from "../Modal/CollabModal";
import VersionHistoryModal from "../Modal/VersionHistoryModal";
import { useTranslation } from "react-i18next";

function ButtonIcon({
  onImageUpload,
  uploadedImages,
  setUploadedImages,
  noteId,
  note,
  isArchived,
  permission,
  isNewNote = false,
  setTempTags,
  setShowChecklist,
  setIsExpanded,
  setValue,
  setSelectedColor,
  setSelectedTheme,
  setTempReminders,
  isEdit,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation(); 
  const [moreAnchor, setMoreAnchor] = useState(null);
  const [tagAnchor, setTagAnchor] = useState(null);
  const [anchorNotify, setAnchorNotify] = useState(null);
  const [paintAnchor, setPaintAnchor] = useState(null);
  const [openCollab, setOpenCollab] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const [selectedColor, setLocalSelectedColor] = useState(
    note?.color || "Default"
  );
  const [selectedTheme, setLocalSelectedTheme] = useState(
    note?.theme || "Default"
  );

  const moreButtonRef = useRef(null);
  const imageInputRef = useRef();
  const navigate = useNavigate();

  const tags = useSelector((state) => state.tag.listTags);

  const currentNote = note || {};

  // Select tag
  const selectedTags = (currentNote.tags || []).map((tag) => tag.id);

  // Fetching note tags
  useEffect(() => {
    if (tagAnchor && noteId && !isNewNote) {
      dispatch(getTagsNote(noteId));
    }
  }, [dispatch, noteId, tagAnchor, isNewNote]);

  // Select images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    if (isNewNote) {
      setUploadedImages((prev) => [...prev, ...filePreviews]);
    }
    if (!isNewNote) {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      dispatch(uploadImageNote({ noteId, formData }));
    }
  };

  const handleArchiveNote = (isArchived) => {
    const archive = {
      isArchived: !isArchived,
    };
    dispatch(archivedNote({ noteId, isArchived: archive.isArchived }));
  };

  // Sorft delete note
  const handlesoftDeleteNote = () => {
    dispatch(softDeleteNote({ noteId: noteId }))
      .unwrap()
      .then(() => {
        setMoreAnchor(null);
      })
      .catch((err) => {
        console.error("Failed to archive note:", err);
      });
  };

  // Restore note
  const handleRestoreNote = () => {
    dispatch(restoreNote({ noteId: noteId }))
      .unwrap()
      .then(() => {
        setMoreAnchor(null);
      })
      .catch((err) => {
        console.error("Failed to restore note:", err);
      });
  };

  // Delete note
  const handleDeleteNote = () => {
    dispatch(deleteNote({ noteId: noteId }))
      .unwrap()
      .then(() => {
        setMoreAnchor(null);
      })
      .catch((err) => {
        console.error("Failed to delete note:", err);
      });
  };

  // Handle color and theme selection
  const handleSelectColor = (color) => {
    setLocalSelectedColor(color);
    if (isNewNote) {
      setSelectedColor(color);
    } else if (noteId) {
      dispatch(
        settingNote({
          noteId,
          color,
          theme: selectedTheme || "Default",
        })
      );
    }
  };

  const handleSelectTheme = (theme) => {
    setLocalSelectedTheme(theme);
    if (isNewNote) {
      setSelectedTheme(theme);
    } else if (noteId) {
      dispatch(
        settingNote({
          noteId,
          color: selectedColor || "Default",
          theme,
        })
      );
    }
  };

  useEffect(() => {
    if (currentNote) {
      setLocalSelectedColor(currentNote.color || "Default");
      setLocalSelectedTheme(currentNote.theme || "Default");
    }
  }, [currentNote]);

  return (
    <Box
      sx={{ display: "flex", gap: 1, mt: 1 }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {note?.deletedAt ? (
        <>
          <Tooltip title={t("delete forever")}>
            <IconButton onClick={handleDeleteNote}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("restore")}>
            <IconButton onClick={handleRestoreNote}>
              <RestoreFromTrashIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          {/* Start reminder */}
          <Tooltip title={t("reminder")}>
            <IconButton onClick={(e) => setAnchorNotify(e.currentTarget)}>
              <AddAlertOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <ReminderMenu
            noteId={noteId}
            isNewNote={isNewNote}
            note={currentNote}
            setTempReminders={setTempReminders}
            anchorEl={anchorNotify}
            onClose={() => setAnchorNotify(null)}
          />
          {/* End reminder */}

          {/* Start selected color and theme */}
          <Tooltip title={t("paint")}>
            <IconButton onClick={(e) => setPaintAnchor(e.currentTarget)}>
              <PaletteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <ColorThemePicker
            anchorEl={paintAnchor}
            onClose={() => setPaintAnchor(null)}
            onSelectColor={handleSelectColor}
            onSelectTheme={handleSelectTheme}
            selectedColor={selectedColor}
            selectedTheme={selectedTheme}
          />
          {/* End selected color and theme */}

          <Tooltip title={t("image")}>
            <IconButton onClick={() => imageInputRef.current.click()}>
              <ImageOutlinedIcon fontSize="small" />
            </IconButton>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </Tooltip>

          {/* Start collab */}
          {!isNewNote && (
            <>
              <Tooltip title={t("collab")}>
                <span>
                  <IconButton
                    onClick={() => setOpenCollab(true)}
                    disabled={permission}
                  >
                    <PersonAddAltOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={isArchived ? t("restore") : t("archive")}>
                <IconButton onClick={() => handleArchiveNote(isArchived)}>
                  <ArchiveOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          <CollabModal
            open={openCollab}
            onClose={() => setOpenCollab(false)}
            noteId={noteId}
          />
          {/* End collab */}

          {/* Start More */}
          <Tooltip title={t("more")}>
            <IconButton
              onClick={(e) => setMoreAnchor(e.currentTarget)}
              ref={moreButtonRef}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Start menu more */}
          <Menu
            anchorEl={moreAnchor}
            open={Boolean(moreAnchor)}
            onClose={() => setMoreAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <MenuItem
              onClick={() => {
                setTagAnchor(moreButtonRef.current);
                setMoreAnchor(null);
              }}
              disabled={permission}
            >
              {t("add label")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMoreAnchor(null), navigate(`/draw/${noteId}`);
              }}
            >
              {t("add drawing")}
            </MenuItem>
            {!isNewNote && (
              <MenuItem onClick={handlesoftDeleteNote} disabled={permission}>
                {t("delete note")}
              </MenuItem>
            )}
            {!isNewNote && (
              <MenuItem onClick={() => setOpenHistoryModal(true)}>
                {t("version history")}
              </MenuItem>
            )}

            {isNewNote && (
              <MenuItem
                onClick={() => {
                  setShowChecklist(true);
                  setIsExpanded(true);
                  setMoreAnchor(null);
                }}
              >
                {t("add checkboxes")}
              </MenuItem>
            )}
          </Menu>
          <VersionHistoryModal
            noteId={noteId}
            openHistoryModal={openHistoryModal}
            onClose={() => setOpenHistoryModal(false)}
          />
          {/*End menu more */}
          {/* End More */}

          {/* Start menu selected labels for note */}
          <Popover
            open={Boolean(tagAnchor)}
            anchorEl={tagAnchor}
            onClose={() => setTagAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            disableRestoreFocus
          >
            <LabelMenu
              anchorEl={tagAnchor}
              onClose={() => setTagAnchor(null)}
              tags={tags}
              noteId={noteId}
              selectedTags={selectedTags}
              note={currentNote}
              isNewNote={isNewNote}
              setTempTags={setTempTags}
            />
          </Popover>
          {/* End menu selected labels for note */}
        </>
      )}
    </Box>
  );
}

export default memo(ButtonIcon);
