const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];

const VIDEO_EMBED_HOSTS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "dailymotion",
];

export function isValidUrl(url: string): boolean {
  try {
    // Handle relative URLs
    if (url.startsWith("/") || url.startsWith(".")) {
      return true;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getAbsoluteUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl;
  }
}

export function getMediaType(url: string): "image" | "video" | null {
  const urlLower = url.toLowerCase();
  const path = urlLower.split("?")[0];

  if (IMAGE_EXTENSIONS.some((ext) => path.endsWith(ext))) {
    return "image";
  }

  if (VIDEO_EXTENSIONS.some((ext) => path.endsWith(ext))) {
    return "video";
  }

  return null;
}

export function isVideoEmbedUrl(url: string): boolean {
  return VIDEO_EMBED_HOSTS.some((host) => url.includes(host));
}
