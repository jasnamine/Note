import FormatColorResetOutlinedIcon from "@mui/icons-material/FormatColorResetOutlined";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";

import foodDark from "../assets/images/food_dark_thumb_0615.svg";
import foodLight from "../assets/images/food_light_thumb_0615.svg";

import groceryDark from "../assets/images/grocery_dark_thumb_0615.svg";
import groceryLight from "../assets/images/grocery_light_thumb_0615.svg";

import musicDark from "../assets/images/music_dark_thumb_0615.svg";
import musicLight from "../assets/images/music_light_thumb_0615.svg?url";

import notesDark from "../assets/images/notes_dark_thumb_0715.svg";
import notesLight from "../assets/images/notes_light_thumb_0615.svg?url";

import placesDark from "../assets/images/places_dark_thumb_0615.svg";
import placesLight from "../assets/images/places_light_thumb_0615.svg";

import recipeDark from "../assets/images/recipe_dark_thumb_0615.svg";
import travelDark from "../assets/images/travel_dark_thumb_0615.svg";
import videoDark from "../assets/images/video_dark_thumb_0615.svg";

import recipeLight from "../assets/images/recipe_light_thumb_0615.svg";
import travelLight from "../assets/images/travel_light_thumb_0615.svg";
import videoLight from "../assets/images/video_light_thumb_0615.svg";

export const colors = [
  {
    type: "icon",
    value: "none",
    name: "Default",
    icon: <FormatColorResetOutlinedIcon />,
  },
  { type: "color", value: "#faafa8", dark: "#77172e", name: "Coral" },
  { type: "color", value: "#f39f76", dark: "#692b17", name: "Peach" },
  { type: "color", value: "#fff8b8", dark: "#7c4a03", name: "Sand" },
  { type: "color", value: "#e2f6d3", dark: "#264d3b", name: "Mint" },
  { type: "color", value: "#b4ddd3", dark: "#0c625d", name: "Sage" },
  { type: "color", value: "#d4e4ed", dark: "#256377", name: "Fog" },
  { type: "color", value: "#aeccdc", dark: "#284255", name: "Storm" },
  { type: "color", value: "#d3bfdb", dark: "#472e5b", name: "Dusk" },
  { type: "color", value: "#f6e2dd", dark: "#6c394f", name: "Blossom" },
  { type: "color", value: "#e9e3d4", dark: "#4b443a", name: "Clay" },
];

export const themes = [
  {
    type: "icon",
    value: "none",
    name: "Default",
    icon: <HideImageOutlinedIcon />,
  },
  { type: "image", value: foodLight, name: "Food", dark: foodDark },
  { type: "image", value: groceryLight, name: "Grocery", dark: groceryDark },
  { type: "image", value: musicLight, name: "Music", dark: musicDark },
  { type: "image", value: notesLight, name: "Note", dark: notesDark },
  { type: "image", value: placesLight, name: "Place", dark: placesDark },
  { type: "image", value: recipeLight, name: "Recipe", dark: recipeDark },
  { type: "image", value: travelLight, name: "Travel", dark: travelDark },
  { type: "image", value: videoLight, name: "Video", dark: videoDark },
];
