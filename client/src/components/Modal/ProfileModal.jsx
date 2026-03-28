import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Box, Button, Modal, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { editUser, getUser } from "../../redux/api/user";
import { getInitialsFullname } from "../../utils/helpers";
import InputField from "../Input/InputField";
import AuthTitle from "../Typography/AuthTitle";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ProfileModal = ({ open, onClose }) => {
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const { t } = useTranslation();
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);

  const schema = yup.object({
    fullname: yup.string().required("Full Name is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      fullname: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        fullname: user.fullname || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    setPreviewSource("");
    setSelectedFile(null);
    setFileInputState("");
  }, [onClose]);

  useEffect(() => {
    if (open) {
      dispatch(getUser());
    }
  }, [open, dispatch]);

  const onSubmit = (data) => {
    const payload = {
      fullname: data.fullname,
      avatar: selectedFile,
    };

    dispatch(editUser(payload))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <AuthTitle>{t("my account")}</AuthTitle>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {previewSource && (
              <Avatar src={previewSource} sx={{ width: 80, height: 80 }} />
            )}

            {!previewSource && user?.avatar && (
              <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
            )}

            {!previewSource && !user?.avatar && (
              <Avatar sx={{ width: 80, height: 80 }}>
                {getInitialsFullname(user?.fullname)}
              </Avatar>
            )}
          </Box>
          <Button component="label" fullWidth sx={{ my: 1 }}>
            {t("change avt")}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileInputChange}
              value={fileInputState}
            />
          </Button>
          <Stack spacing={2}>
            <InputField
              id="username"
              name="username"
              disabled
              control={control}
              errors={errors}
              label={t("username")}
            />

            <InputField
              id="email"
              name="email"
              disabled
              control={control}
              errors={errors}
              label="Email"
            />

            <InputField
              id="fullname"
              name="fullname"
              control={control}
              errors={errors}
              label={t("fullname")}
            />
          </Stack>
          <Button
            variant="outlined"
            onClick={onClose}
            color="primary"
            sx={{ mt: 2, float: "right" }}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 1, float: "right" }}
          >
            {t("save")}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
