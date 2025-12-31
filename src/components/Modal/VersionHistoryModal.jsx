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

const versionData = [
  {
    version: "v6.0",
    title: "Added two new lessons",
    author: "Dakshi Khatri",
    time: "1 hour ago",
    highlight: true,
  },
  {
    version: "v5.0",
    title:
      "New images added to Lesson 2. Quiz and Survey added to Lesson 3,4,5 & 6",
    author: "Mukul Joshi",
    time: "14 hours ago",
  },
  {
    version: "v4.0",
    title: "New images added to Lesson 2",
    author: "Shuchit Gandhi",
    time: "Yesterday",
  },
  {
    title: "Updated new quiz questions",
    author: "Suhani Ashok",
    time: "3 days ago",
  },
  {
    title: "Lesson 10 updated",
    author: "Suhani Ashok",
    time: "5 days ago",
  },
  {
    title: "Updated examples in introduction",
    author: "Sarvesh Pansare",
    time: "3 Mar, 2022",
  },
];

export default function VersionHistoryModal({
  openHistoryModal,
  onClose,
  noteId,
}) {
  const dispatch = useDispatch();
  const historyData = useSelector((state) => state.history.historyNote);
  useEffect(() => {
    if (openHistoryModal) {
      dispatch(getHistoryNote({noteId}));
    }
  }, [openHistoryModal]);
  return (
    <Box>
      {/* Modal */}
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
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Version History
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Timeline */}
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
                      // backgroundColor: item.highlight ? "black" : "grey.200",
                      // color: item.highlight ? "white" : "black",
                      fontWeight: "bold",
                      "& .MuiChip-icon": {
                        // color: item.highlight ? "white" : "black",
                      },
                    }}
                  />

                  {idx < historyData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: 3 }}>
                  <Typography variant="body1" fontWeight="500">
                    Updated {item.title}
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
