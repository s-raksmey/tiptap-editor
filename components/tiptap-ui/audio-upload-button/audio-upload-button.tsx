"use client";

import { Button } from "@/components/tiptap-ui-primitive/button";
import type { Editor } from "@tiptap/react";

interface AudioUploadButtonProps {
  editor: Editor | null;
}

export function AudioUploadButton({ editor }: AudioUploadButtonProps) {
  async function handleClick() {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/audio", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data?.message || "Upload failed");
          return;
        }

        editor.chain().focus().setAudio(data.data.url).run();
      } catch (error) {
        console.error("Audio upload failed:", error);
        alert("Audio upload failed");
      }
    };

    input.click();
  }

  return (
    <Button
      type="button"
      data-style="ghost"
      data-tooltip="Add Audio"
      onClick={handleClick}
    >
      Add Audio
    </Button>
  );
}
