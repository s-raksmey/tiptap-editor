"use client";

import { Button } from "@/components/tiptap-ui-primitive/button";
import type { Editor } from "@tiptap/react";

interface VideoUploadButtonProps {
  editor: Editor | null;
}

export function VideoUploadButton({ editor }: VideoUploadButtonProps) {
  async function handleClick() {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/video", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data?.message || "Upload failed");
          return;
        }

        editor.chain().focus().setVideo(data.data.url).run();
      } catch (error) {
        console.error("Video upload failed:", error);
        alert("Video upload failed");
      }
    };

    input.click();
  }

  return (
    <Button
      type="button"
      data-style="ghost"
      data-tooltip="Add Video"
      onClick={handleClick}
    >
      Add Video
    </Button>
  );
}
