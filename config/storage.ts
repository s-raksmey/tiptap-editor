export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const PDF_MIME_TYPES = ["application/pdf"] as const;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_PDF_SIZE = 20 * 1024 * 1024;
