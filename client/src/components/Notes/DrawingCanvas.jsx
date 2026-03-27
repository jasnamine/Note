import BrushIcon from "@mui/icons-material/Brush";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CropSquareTwoToneIcon from "@mui/icons-material/CropSquareTwoTone";
import { Box, Button, IconButton, Slider, Stack, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { uploadImageNote } from "../../redux/api/imageNote";
// import { addDrawing } from "../../redux/slice/drawingSlice";
import { addImage } from "../../redux/slice/formSlice";

function DrawingCanvas() {
  const canvasRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { noteId } = useParams();

  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isErasing, setIsErasing] = useState(false);

  const handleClear = () => canvasRef.current.clearCanvas();
  const handleSave = async () => {
    const base64 = await canvasRef.current.exportImage("png");
    const res = await fetch(base64);
    const blob = await res.blob();
    const file = new File([blob], "drawing.png", { type: "image/png" });
    const preview = URL.createObjectURL(file);
    if (!noteId || noteId === "null" || noteId === "undefined") {
      // dispatch(addDrawing({ file, preview }));
      dispatch(addImage({ file, preview }));
      navigate("/");
    } else {
      const formData = new FormData();
      formData.append("images", file);
      dispatch(uploadImageNote({ noteId, formData }));
      navigate("/");
    }
  };

  const toggleEraser = () => {
    setIsErasing((prev) => {
      const newState = !prev;
      canvasRef.current.eraseMode(newState);
      return newState;
    });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Canvas */}
      <ReactSketchCanvas
        ref={canvasRef}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        width="100%"
        height="100%"
        style={{ border: "1px solid #ddd", borderRadius: 4 }}
      />

      {/* Tools */}
      <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        <Tooltip title="Color">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            style={{ width: 40, height: 40, border: "none", cursor: "pointer" }}
          />
        </Tooltip>

        <Tooltip title="Brush size">
          <Slider
            value={strokeWidth}
            onChange={(e, value) => setStrokeWidth(value)}
            min={1}
            max={20}
            sx={{ width: 100 }}
          />
        </Tooltip>

        <Tooltip title="Pen">
          <IconButton
            onClick={() => {
              setIsErasing(false);
              canvasRef.current.eraseMode(false);
            }}
          >
            <BrushIcon color={!isErasing ? "primary" : "inherit"} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Eraser">
          <IconButton onClick={toggleEraser}>
            <CropSquareTwoToneIcon color={isErasing ? "primary" : "inherit"} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear All">
          <IconButton onClick={handleClear}>
            <ClearAllIcon />
          </IconButton>
        </Tooltip>

        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </Box>
  );
}

export default DrawingCanvas;
