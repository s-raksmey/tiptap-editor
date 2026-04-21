import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
  PDF_MIME_TYPES,
} from "@/config/storage";

export function validateFile(file: File) {
  const isImage = IMAGE_MIME_TYPES.includes(
    file.type as (typeof IMAGE_MIME_TYPES)[number],
  );

  const isPdf = PDF_MIME_TYPES.includes(
    file.type as (typeof PDF_MIME_TYPES)[number],
  );

  if (!isImage && !isPdf) {
    throw new Error("Only images and PDF files are allowed");
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size exceeds the 10MB limit");
  }

  if (isPdf && file.size > MAX_PDF_SIZE) {
    throw new Error("PDF size exceeds the 20MB limit");
  }
}

export function generateFileKey(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (file.type === "application/pdf") {
    return `uploads/pdfs/${crypto.randomUUID()}.${extension}`;
  }

  return `uploads/images/${crypto.randomUUID()}.${extension}`;
}
