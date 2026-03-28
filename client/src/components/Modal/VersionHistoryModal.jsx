import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Box, Chip, IconButton, Modal, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistoryNote } from "../../redux/api/historyNote";
import { useTranslation } from "react-i18next";

export default function VersionHistoryModal({
  openHistoryModal,
  onClose,
  noteId,
}) {
  const dispatch = useDispatch();
  const historyData = useSelector((state) => state.history.historyNote);
  const {t} = useTranslation()
  useEffect(() => {
    if (openHistoryModal) {
      dispatch(getHistoryNote({noteId}));
    }
  }, [openHistoryModal]);
  return (
    <Box>
      <Modal open={openHistoryModal} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {t("version history")}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Timeline
            position="right"
            sx={{
              [`& .MuiTimelineItem-root:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {historyData?.map((item, idx) => (
              <TimelineItem key={idx}>
                <TimelineSeparator>
                  <Chip
                    icon={<AssignmentOutlinedIcon sx={{ fontSize: 16 }} />}
                    label="v1.0"
                    size="small"
                    sx={{
                      mt: 1,
                      mb: 0.5,
                    }}
                  />

                  {idx < historyData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 3 }}>
                  <Typography variant="body1" fontWeight="500">
                    {t("updated")} {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.modifier.username} • {item.modifiedAt}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </Modal>
    </Box>
  );
}
