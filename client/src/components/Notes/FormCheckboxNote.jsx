import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Checkbox,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

function FormCheckboxNote({ control, note, permission }) {
  const isReadOnly = note?.deletedAt || permission === "view";
  const { t } = useTranslation();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "checklistItems",
  });

  const items = useWatch({ control, name: "checklistItems" });

  const handleCheck = (index) => {
    if (isReadOnly) return;
    update(index, {
      ...items[index],
      isDone: !items[index].isDone,
    });
  };

  const handleAddItem = () => {
    if (isReadOnly) return;
    append({
      id: uuidv4(),
      title: "",
      isDone: false,
    });
  };

  const completed = items?.filter((item) => item?.isDone);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          borderTop: "1px solid #e0e0e0",
          borderBottom: "1px solid #e0e0e0",
          borderRadius: 0,
          px: 1,
        }}
      >
        {fields.map((item, index) =>
          !items[index]?.isDone ? (
            <Box key={item.id} sx={{ display: "flex", alignItems: "center" }}>
              <Controller
                name={`checklistItems.${index}.isDone`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    sx={{
                      "&.Mui-checked": {
                        color: "rgb(32,33,36)",
                      },
                    }}
                    onChange={() => handleCheck(index)}
                    disabled={isReadOnly}
                  />
                )}
              />
              <Controller
                name={`checklistItems.${index}.title`}
                control={control}
                render={({ field }) => (
                  <InputBase
                    {...field}
                    placeholder="List item"
                    disabled={isReadOnly}
                    fullWidth
                  />
                )}
              />
              <IconButton disabled={isReadOnly} onClick={() => remove(index)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : null
        )}
      </Paper>

      <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 1 }}>
        <IconButton disabled={isReadOnly} onClick={handleAddItem}>
          <AddIcon />
        </IconButton>
        <Typography color="text.secondary">{t("list item")}</Typography>
      </Box>

      {completed?.length > 0 && (
        <>
          <Typography
            sx={{
              fontSize: 14,
              mb: 1,
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {completed.length} {t("completed items")}
          </Typography>

          {fields.map((item, index) =>
            items[index]?.isDone ? (
              <Box
                key={item.id}
                sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
              >
                <Controller
                  name={`checklistItems.${index}.isDone`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      sx={{
                        "&.Mui-checked": {
                          color: "rgb(32,33,36)",
                        },
                        "&.Mui-disabled.Mui-checked": {
                          color: "rgb(32,33,36)",
                        },
                      }}
                      disabled={isReadOnly}
                      onChange={() => handleCheck(index)}
                    />
                  )}
                />
                <Typography
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                    flexGrow: 1,
                  }}
                >
                  {items[index]?.title}
                </Typography>
                <IconButton disabled={isReadOnly} onClick={() => remove(index)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : null
          )}
        </>
      )}
    </Box>
  );
}

export default FormCheckboxNote;
