export const getInitialsFullname = (name) => {
  if (!name) {
    return "";
  }

  const words = name.split(" ");
  let initials = "";
  if (name.length === 1) {
    initials = words[0][0];
  } else {
    initials = words
      .slice(0, 2)
      .map((word) => word[0])
      .join("");
  }
  return initials.toUpperCase();
};

export const formatDateForUser = (date) => {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
};

export const formatDateForMySQL = (date) => {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
};
export const getBackgroundImg = (theme) => {
  if (!theme?.value) {
    return "none";
  }
  if (setting === "light") {
    return `url(${theme?.value})`;
  }
  if (setting === "dark") {
    return `url(${theme?.dark})`;
  }
};

export const getBackgroundColor = (color) => {
  if (setting === "light") {
    return color?.value;
  }
  if (setting === "dark") {
    return color?.dark;
  }
};
