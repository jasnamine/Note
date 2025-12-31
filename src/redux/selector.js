import { createSelector } from "@reduxjs/toolkit";

// export const selectNoteWithTagsAndImages = createSelector(
//   [
//     (state) => state.notes.listNotes,
//     (state) => state.tag?.tagsByNoteId,
//     (state) => state.image.imagesByNoteId,
//     (_, noteId) => noteId,
//   ],
//   (listNotes, tagsByNoteId, imagesByNoteId, noteId) => {
//       const note = listNotes.find((n) => n.id === noteId);
//           console.log(
//             "noteId:",
//             noteId,
//             "listNotes:",
//             listNotes,
//             "note:",
//             note,
//             "tagsByNoteId:",
//             tagsByNoteId
//           );
//     if (!note) return null;
//     return {
//       ...note,
//       tags: tagsByNoteId[noteId] || [],
//       images: imagesByNoteId[noteId] || [],
//     };
//   }
// );

export const selectNoteWithTagsAndImages = createSelector(
  [
    (state) => state.notes.listNotes || [],
    (state) => state.tagNote?.tagsByNoteId || {},
    (state) => state.image?.imagesByNoteId || {},
    (_, noteId) => noteId,
  ],
  (listNotes, tagsByNoteId, imagesByNoteId, noteId) => {
    const note = listNotes.find((n) => n.id === noteId);
    console.log(
      "noteId:",
      noteId,
      "listNotes:",
      listNotes,
      "note:",
      note,
      "tagsByNoteId:",
      tagsByNoteId
    );
    if (!note) return null;

    return {
      ...note,
    //   tags: tagsByNoteId[noteId] || [],
    //   images: imagesByNoteId[noteId] || [],
    };
  }
);
