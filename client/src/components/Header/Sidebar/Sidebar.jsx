import { LightbulbOutlined } from "@mui/icons-material";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getTags } from "../../../redux/api/tag";
import LabelModal from "../../Modal/LabelModal";

const Sidebar = ({ open, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const tags = useSelector((state) => state?.tag?.listTags ?? []);
  useEffect(() => {
    dispatch(getTags());
  }, []);
  const [openModal, setOpenModal] = useState(false);

  const drawerContent = (
    <Box sx={{ mt: 8, width: 240 }}>
      <List>
        {/* Notes */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/")}
            sx={{
              bgcolor: location.pathname === "/" ? "#ffd54f" : "transparent",
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
            }}
          >
            <ListItemIcon>
              <LightbulbOutlined />
            </ListItemIcon>
            <ListItemText primary={t("notes")} />
          </ListItemButton>
        </ListItem>

        {/* Labels - opens modal */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setOpenModal(true)}
            sx={{
              border: openModal ? "1px solid black" : "none",
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
            }}
          >
            <ListItemIcon>
              {tags ? <EditIcon /> : <LabelOutlinedIcon />}
            </ListItemIcon>
            <ListItemText primary={tags ? t("edit label") : t("labels")} />
          </ListItemButton>
        </ListItem>

        {tags?.map((tag) => (
          <ListItem key={tag?.id} disablePadding>
            <ListItemButton onClick={() => navigate(`/tag/${tag.name}`)}>
              <ListItemIcon>
                <LabelOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={tag?.name} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/archive")}
            sx={{
              bgcolor:
                location.pathname === "/archive" ? "#ffd54f" : "transparent",
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
            }}
          >
            <ListItemIcon>
              <ArchiveOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={t("archive")} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/trash")}
            sx={{
              bgcolor:
                location.pathname === "/trash" ? "#ffd54f" : "transparent",
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
            }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={t("trash")} />
          </ListItemButton>
        </ListItem>
      </List>

      <LabelModal open={openModal} handleClose={() => setOpenModal(false)} />
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      role="presentation"
      onClose={handleDrawerToggle}
      variant="temporary"
      ModalProps={{
        keepMounted: true,
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
