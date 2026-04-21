import { NextResponse } from "next/server";

import { s3Storage } from "@/storage";
import { generateFileKey, validateFile } from "@/storage/helpers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 },
      );
    }

    validateFile(file);

    const key = generateFileKey(file);
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const size = file.size / 1024;
    const buffer = new Uint8Array(await file.arrayBuffer());

    const url = await s3Storage.upload({
      key,
      buffer,
      mime: file.type,
    });

    return NextResponse.json({
      success: true,
      data: {
        url,
        key,
        filename: file.name,
        extension,
        size,
      },
    });
  } catch (error) {
    console.error("[UPLOAD_ROUTE_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}
