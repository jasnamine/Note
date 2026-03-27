const getPublicIdFromUrl = (url) => {
  try {
    const parts = new URL(url).pathname.split("/");
    const versionIndex = parts.findIndex((p) => /^v\d+/.test(p));
    const fileParts = parts.slice(versionIndex + 1);
    const publicId = fileParts.join("/").replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (error) {
    return null;
  }
}

module.exports = { getPublicIdFromUrl };
