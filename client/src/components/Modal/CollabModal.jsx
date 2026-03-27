import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Avatar,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  addColaborator,
  getCollaborators,
  removeCollaborator,
  updateCollaboratorPermission,
} from "../../redux/api/collab";
import { clearCollabMessages } from "../../redux/slice/noteSlice";
import { getInitialsFullname } from "../../utils/helpers";
import ErrorMessage from "../Input/ErrorMessage";
import InputField from "../Input/InputField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
};

const CollabModal = ({ open, onClose, noteId }) => {
  const dispatch = useDispatch();
  const collab = useSelector((state) => state.notes?.collab);
  const user = useSelector((state) => state.user?.userData);
  const userGoogleLogin = useSelector((state) => state.auth?.googleLogin?.msg);

  useEffect(() => {
    if (open) {
      dispatch(getCollaborators({ noteId }));
      dispatch(clearCollabMessages());
      reset();
    }
  }, [open, dispatch]);

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Enter email please"),
    permission: yup.string().oneOf(["view", "edit"]).required(),
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      permission: "view",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(
      addColaborator({ noteId, email: data.email, permission: data.permission })
    )
      .unwrap()
      .then(() => {
        reset();
      });
  };

  const handleDeleteCollaborator = (noteId, collaboratorUserId) => {
    dispatch(removeCollaborator({ noteId, collaboratorUserId }));
  };

  const handleUpdatePermission = (
    noteId,
    collaboratorUserId,
    newPermission
  ) => {
    dispatch(
      updateCollaboratorPermission({
        noteId,
        collaboratorUserId,
        newPermission,
      })
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} onClick={(e) => e.stopPropagation()} id="collab-modal">
        {/* Header */}
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
          Collaborators
        </Typography>
        <Divider sx={{ mb: 1 }} />

        {/* Owner info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          {user?.avatar && <Avatar src={user?.avatar} />}

          {!user?.avatar && userGoogleLogin?.fullname && (
            <Avatar>{getInitialsFullname(userGoogleLogin?.fullname)}</Avatar>
          )}

          {!user?.avatar && user.fullname && (
            <Avatar>{getInitialsFullname(user?.fullname)}</Avatar>
          )}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user.username}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", color: "text.secondary" }}
              >
                (Owner)
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.3 }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>

        {collab?.collaborators?.length > 0 &&
          collab?.collaborators.map((c, index) => (
            <Box
              key={c?.id || `${c?.user?.id}-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              {/* Left: Avatar + Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar src={c?.avatar}>
                  {!c?.user?.avatar && getInitialsFullname(c?.fullname)}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {c?.username}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.3 }}
                  >
                    {c?.email}
                  </Typography>
                </Box>
              </Box>

              <Tooltip title={`Delete ${c?.username}`} placement="top">
                <IconButton
                  onClick={() => handleDeleteCollaborator(noteId, c.userId)}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Select
                size="small"
                value={c?.permission}
                onChange={(e) =>
                  handleUpdatePermission(noteId, c.userId, e.target.value)
                }
                sx={{
                  fontSize: 14,
                  px: 1,
                  borderRadius: 1,
                  backgroundColor: "#f5f5f5",
                  height: 36,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-select": { padding: 0 },
                }}
              >
                <MenuItem value="view">View</MenuItem>
                <MenuItem value="edit">Edit</MenuItem>
              </Select>
            </Box>
          ))}

        {/* Form thêm cộng tác viên */}
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#e0e0e0",
                width: 40,
                height: 40,
                color: "black",
                mb: errors.email ? "30px" : 0,
              }}
            >
              +
            </Avatar>
            <InputField
              id="email"
              name="email"
              control={control}
              errors={errors}
              required
              placeholder="Person or email to share with"
              custom
            />

            <Box sx={{ ml: 6 }}>
              <Controller
                name="permission"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    displayEmpty
                    sx={{
                      fontSize: 14,
                      px: 1,
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                      height: 36,
                      mb: errors.email ? "30px" : 0,
                      ml: "85%",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        padding: 0,
                      },
                    }}
                  >
                    <MenuItem value="view">View</MenuItem>
                    <MenuItem value="edit">Edit</MenuItem>
                  </Select>
                )}
              />
            </Box>
          </Box>

          {collab?.messageError && (
            <Box sx={{ ml: "11%" }}>
              <ErrorMessage message={collab?.messageError} />
            </Box>
          )}

          {collab?.messageSuccess && (
            <Alert
              severity="success"
              sx={{ bgcolor: "transparent", ml: "35px" }}
            >
              {collab?.messageSuccess}
            </Alert>
          )}

          {/* Buttons */}
          <Box sx={{ display: "block", float: "right", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CollabModal;
