import BrushIcon from "@mui/icons-material/Brush";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNote } from "../../redux/api/note";
import { addMultipleTags } from "../../redux/api/tagNote";
import { createMultipleReminders } from "../../redux/api/remind.js";
import { resetForm, setFormData } from "../../redux/slice/formSlice.js";
import { formatDateForUser } from "../../utils/helpers.js";
import { colors, themes } from "../../utils/staticData.jsx";
import ButtonIcon from "../Button/ButtonIcon";
import ReminderModal from "../Modal/ReminderModal.jsx";
import FormCheckboxNote from "./FormCheckboxNote";
import { useTranslation } from "react-i18next";

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userTheme = useSelector(
    (state) => state?.user?.userData?.settings?.theme
  );
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [tempTags, setTempTags] = useState([]);
  const [tempReminders, setTempReminders] = useState([]);
  const [openReminderModal, setOpenReminderModal] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);

  const ref = useRef();
  const imageInputRef = useRef();

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
      color: "Default",
      theme: "Default",
      checklistItems: [{ id: "", title: "", isDone: false }],
    },
  });

  const selectedColor = useWatch({ control, name: "color" });
  const selectedTheme = useWatch({ control, name: "theme" });
  const title = useWatch({ control, name: "title" });
  const content = useWatch({ control, name: "content" });
  const checklistItems = useWatch({ control, name: "checklistItems" });

  const getBackgroundColor = (colorName) => {
    const color = colors.find((c) => c.name === colorName);
    if (!color) return userTheme === "dark" ? "#000000" : "#ffffff";
    return userTheme === "light" ? color.value : color.dark;
  };

  const getBackgroundImg = (themeName) => {
    const theme = themes.find((t) => t.name === themeName);
    if (!theme?.value) return "none";
    return `url(${userTheme === "light" ? theme.value : theme.dark})`;
  };
  const formDataState = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(
      setFormData({
        title,
        content,
        tags: tempTags,
        color: selectedColor,
        theme: selectedTheme,
        images: uploadedImages,
        reminders: tempReminders,
        checklistItems,
      })
    );
  }, [
    tempTags,
    selectedColor,
    selectedTheme,
    uploadedImages,
    tempReminders,
    checklistItems,
    title,
    content,
  ]);

  useEffect(() => {
    setTempTags(formDataState.tags || []);
    setUploadedImages(formDataState.images || []);
    setTempReminders(formDataState.reminders || []);
    setValue("color", formDataState.color || "Default");
    setValue("theme", formDataState.theme || "Default");
    setValue("title", formDataState.title || "");
    setValue("content", formDataState.content || "");
    setValue(
      "checklistItems",
      formDataState.checklistItems || [{ id: "", title: "", isDone: false }]
    );
  }, []);

  const handleEditReminder = (reminder) => {
    setReminderToEdit(reminder);
    setOpenReminderModal(true);
  };

  const handleDeleteReminder = (reminder) => {
    setTempReminders((prev) => prev.filter((r) => r.id !== reminder));
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedImages((prev) => [...prev, ...filePreviews]);
  };


  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append title, color, and theme
    formData.append("title", data.title);
    formData.append("color", data.color || "Default");
    formData.append("theme", data.theme || "Default");

    // Check checklist
    const validChecklist = data.checklistItems?.filter(
      (item) => item?.title?.trim() !== ""
    );

    const hasChecklist = validChecklist.length > 0;

    // If checklist exists
    if (hasChecklist && validChecklist.length > 0) {
      validChecklist.forEach((item, index) => {
        const { id, ...rest } = item;
        Object.entries(rest).forEach(([key, value]) => {
          formData.append(`checklistItems[${index}][${key}]`, value);
        });
      });
    }

    if (data.content?.trim()) {
      formData.append("content", data.content);
    }

    uploadedImages.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      const result = await dispatch(addNote(formData)).unwrap();
      const newNoteId = result.DT?.id;
      if (newNoteId && tempTags.length > 0) {
        const tagIDs = tempTags.map((tag) => tag.id);
        await dispatch(addMultipleTags({ noteId: newNoteId, tagIDs })).unwrap();
      }

      if (newNoteId && tempReminders.length > 0) {
        const filteredReminders = tempReminders.map(({ time, repeat }) => ({
          time,
          repeat,
        }));
        console.log("Filtered reminders:", filteredReminders);
        await dispatch(
          createMultipleReminders({
            noteId: newNoteId,
            reminders: filteredReminders,
          })
        ).unwrap();
      }
      reset({
        title: "",
        content: "",
        color: "Default",
        theme: "Default",
        checklistItems: [{ id: "", title: "", isDone: false }],
      });
      setUploadedImages([]);
      setTempTags([]);
      setShowChecklist([]);
      setIsExpanded(false);
      setShowChecklist(false);
      setTempReminders([]);
      dispatch(resetForm());
    } catch (err) {
      console.error("Add note failed:", err);
    }
  };

  return (
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        width: { xs: "100%", sm: "600px" },
        margin: "auto",
        mt: 3,
        mb: 3,
        borderRadius: 2,
        p: 1,
        boxShadow: isExpanded
          ? "0 2px 8px rgba(0,0,0,0.2)"
          : "0 1px 3px rgba(0,0,0,0.1)",
        bgcolor: getBackgroundColor(selectedColor),
        backgroundImage: getBackgroundImg(selectedTheme),
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {uploadedImages && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 600,
          }}
        >
          {uploadedImages.map((img, index) => {
            const total = uploadedImages.length;
            const itemsInLastRow = total % 3 || 3;
            const lastRowStart = total - itemsInLastRow;

            let width = "calc(33.333% - 2px)";

            if (index >= lastRowStart) {
              if (itemsInLastRow === 1) width = "100%";
              else if (itemsInLastRow === 2) width = "calc(50% - 2px)";
            }

            return (
              <Box
                key={index}
                sx={{
                  width,
                  height: 150,
                  position: "relative",
                  borderRadius: 1,
                  gap: 0.5,
                  overflow: "hidden",
                }}
              >
                <img
                  src={img.preview}
                  alt={`preview-${index}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "white",
                    p: 0.5,
                    fontSize: 12,
                  }}
                >
                  ✕
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}
      {isExpanded && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputBase
                {...field}
                placeholder={t("title")}
                fullWidth
                sx={{ fontWeight: 600 }}
              />
            )}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <InputBase
              {...field}
              placeholder={t("take a note")}
              fullWidth
              multiline
              sx={{ mb: isExpanded ? 1 : 0 }}
              onClick={() => setIsExpanded(true)}
            />
          )}
        />

        {!isExpanded && (
          <Box sx={{ display: "flex" }}>
            <IconButton
              onClick={() => {
                setShowChecklist(true);
                setIsExpanded(true);
              }}
            >
              <CheckBoxOutlinedIcon />
            </IconButton>

            <IconButton
              onClick={() => {
                navigate(`/draw/null`);
                setIsExpanded(true);
              }}
            >
              <BrushIcon />
            </IconButton>

            <IconButton
              onClick={() => {
                imageInputRef.current.click();
              }}
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
              />
              <ImageOutlinedIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {isExpanded && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {tempTags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              onDelete={() =>
                setTempTags((prev) => prev.filter((t) => t.id !== tag.id))
              }
            />
          ))}
          {tempReminders.map((reminder) => (
            <Chip
              key={reminder.id}
              label={formatDateForUser(reminder.time)}
              size="small"
              onClick={() => handleEditReminder(reminder)}
              onDelete={() => handleDeleteReminder(reminder.id)}
            />
          ))}
        </Stack>
      )}

      {(showChecklist || formDataState.checklistItems.length > 1) && (
        <FormCheckboxNote control={control} />
      )}

      {isExpanded && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <ButtonIcon
            onImageUpload={handleImageChange}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            setShowChecklist={setShowChecklist}
            setIsExpanded={setIsExpanded}
            setValue={setValue}
            note={{
              tags: tempTags,
              color: selectedColor,
              theme: selectedTheme,
              remiders: tempReminders,
            }}
            isNewNote={true}
            setTempTags={setTempTags}
            setTempReminders={setTempReminders}
            setSelectedColor={(color) => setValue("color", color)}
            setSelectedTheme={(theme) => setValue("theme", theme)}
          />
          <Box>
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: "none", mr: 1 }}
            >
              {t("add")}
            </Button>
            <Button
              sx={{ textTransform: "none" }}
              onClick={() => {
                setIsExpanded(false);
              }}
            >
              {t("close")}
            </Button>

            <Button
              sx={{ textTransform: "none", color: "red" }}
              onClick={() => {
                reset({
                  title: "",
                  content: "",
                  color: "Default",
                  theme: "Default",
                  checklistItems: [{ id: "", title: "", isDone: false }],
                });
                setUploadedImages([]);
                setTempTags([]);
                setTempReminders([]);
                setShowChecklist(false);
                // dispatch(clearDrawings());
              }}
            >
              {t("reset")}
            </Button>
          </Box>
        </Box>
      )}
      <ReminderModal
        open={openReminderModal}
        onClose={() => {
          setOpenReminderModal(false);
          setReminderToEdit(null);
        }}
        initialReminder={reminderToEdit}
        isEdit={!!reminderToEdit}
        isNewNote={true}
        setTempReminders={setTempReminders}
      />
    </Paper>
  );
}

export default Form;
