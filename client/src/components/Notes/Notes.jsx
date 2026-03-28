import { LightbulbOutlined } from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Note from "../../components/Notes/Note";
import { setAccessToken } from "../../redux/api/axiosWrapper";
import {
  getArchivedNotes,
  getCollabNotes,
  getDeletedNotes,
  getNotes,
  getNotesByTag,
  getPinnedNotes,
} from "../../redux/api/note";

import CategoryTitle from "../Typography/CategoryTitle";
import { useTranslation } from "react-i18next";

function Notes({ typeNote, tagCategory }) {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state?.notes);
  const user = useSelector((state) => state?.auth?.login);
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.token && user?.success) {
      setAccessToken(user?.token);
      dispatch(getPinnedNotes());
      dispatch(getCollabNotes());
      if (typeNote === "listNotes") {
        dispatch(getNotes());
      }
      if (typeNote === "deleteNotes") {
        dispatch(getDeletedNotes());
      }
      if (typeNote === "archivedNotes") {
        dispatch(getArchivedNotes());
      }
      if (tagCategory && typeNote === "listNotesByTag") {
        dispatch(getNotesByTag({ tagId: tagCategory }));
      }
    }
  }, [user?.token, user?.success, dispatch, typeNote, tagCategory]);

  return (
    <>
      {notes?.pinnedNotes?.length > 0 && typeNote === "listNotes" && (
        <Box sx={{ position: "relative", height: "30px" }}>
          <CategoryTitle>{t("pinned")}</CategoryTitle>
        </Box>
      )}

      {notes?.pinnedNotes?.length > 0 && typeNote === "listNotes" && (
        <Box sx={{ px: 1 }}>
          <Masonry
            key={notes?.pinnedNotes?.length}
            columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            sx={{
              width: "auto",
              margin: "0 auto",
            }}
            spacing={2}
            sequential
          >
            {notes?.pinnedNotes.map((note) => (
              <Note
                key={note?.id}
                note={note}
                images={note?.images}
                title={note?.title}
                content={note?.content}
                isPinned={note?.preferences?.[0]?.isPinned}
                isArchived={note?.preferences?.[0]?.isArchived}
                checklists={note?.checklists}
                tags={note?.tags}
                reminders={note?.reminders}
                collaborators={note?.collaborators}
                noteId={note?.id}
                noteColor={note?.color}
                noteTheme={note?.theme}
              />
            ))}
          </Masonry>
        </Box>
      )}

      {notes?.collabNotes?.length > 0 && typeNote === "listNotes" && (
        <Box sx={{ position: "relative", height: "30px" }}>
          <CategoryTitle>{t("collab")}</CategoryTitle>
        </Box>
      )}

      {notes?.collabNotes?.length > 0 && typeNote === "listNotes" && (
        <Box sx={{ px: 1 }}>
          <Masonry
            key={notes?.collabNotes?.length}
            columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            sx={{
              width: "auto",
              margin: "0 auto",
            }}
            spacing={2}
            sequential
          >
            {notes?.collabNotes.map((note) => (
              <Note
                key={note?.note?.id}
                note={note?.note}
                images={note?.note?.images}
                title={note?.note?.title}
                content={note?.note?.content}
                isPinned={note?.note?.preferences?.[0]?.isPinned}
                isArchived={note?.note?.preferences?.[0]?.isArchived}
                checklists={note?.note?.checklists}
                tags={note?.note?.tags}
                reminders={note?.note?.reminders}
                collaborators={note?.note?.collaborators}
                owner={note?.note?.owner}
                permission={note?.permission}
                noteId={note?.note?.id}
                noteColor={note?.note?.color}
                noteTheme={note?.note?.theme}
              />
            ))}
          </Masonry>
        </Box>
      )}

      {(notes?.pinnedNotes?.length > 0 || notes?.collabNotes?.length > 0) &&
        typeNote === "listNotes" && (
          <Box sx={{ position: "relative", height: "30px" }}>
            <CategoryTitle>{t("others")}</CategoryTitle>
          </Box>
        )}

      {notes?.[typeNote]?.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <LightbulbOutlined sx={{ fontSize: 60, color: "text.secondary" }} />
          <Box sx={{ mt: 1, fontSize: 18, color: "text.secondary" }}>
            {t("notes you add appear here")}
          </Box>
        </Box>
      ) : (
        <Box sx={{ px: 1 }}>
          <Masonry
            key={notes?.[typeNote]?.length}
            columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            sx={{
              width: "auto",
              margin: "0 auto",
            }}
            spacing={2}
            sequential
          >
            {notes?.[typeNote].map((note) => (
              <Note
                key={note?.id}
                note={note}
                images={note?.images}
                title={note?.title}
                content={note?.content}
                isPinned={note?.preferences?.[0]?.isPinned}
                isArchived={note?.preferences?.[0]?.isArchived}
                checklists={note?.checklists}
                tags={note?.tags}
                reminders={note?.reminders}
                collaborators={note?.collaborators}
                noteId={note?.id}
                noteColor={note?.color}
                noteTheme={note?.theme}
              />
            ))}
          </Masonry>
        </Box>
      )}
    </>
  );
}

export default Notes;
