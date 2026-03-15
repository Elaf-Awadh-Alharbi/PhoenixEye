import { API_BASE_URL } from "../api/axios";

export function getImageUrl(imagePath) {
  if (!imagePath) return null;

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath}`;
}