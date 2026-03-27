import { FormControl, TextField, Typography } from "@mui/material";

import { Controller } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
const InputField = ({
  id,
  label,
  required,
  disabled,
  placeholder,
  type,
  inputProps,
  control,
  name,
  errors,
  custom,
}) => {
  return (
    <FormControl sx={{ mb: label ? 2 : 0 }}>
      {label && (
        <Typography
          variant="subtitle2"
          component="label"
          htmlFor={id}
          sx={{ display: "block", fontWeight: 500, mb: 0.5 }}
        >
          {label}
          {required && (
            <Typography component="span" sx={{ color: "error.main" }}>
              *
            </Typography>
          )}
        </Typography>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextField
            {...field}
            id={id}
            placeholder={placeholder}
            size="small"
            variant="outlined"
            type={type}
            required
            disabled={disabled}
            error={!!errors[name]}
            InputProps={
              custom
                ? {
                    ...inputProps,
                    sx: {
                      fontSize: 14,
                      px: 1,
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                      height: 36,
                      width: "160%",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& input": {
                        padding: 0,
                      },
                    },
                  }
                : inputProps
            }
          />
        )}
      />

      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default InputField;
