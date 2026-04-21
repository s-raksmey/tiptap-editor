"use client";

import { Button } from "@/components/tiptap-ui-primitive/button";
import type { Editor } from "@tiptap/react";

interface PdfUploadButtonProps {
  editor: Editor | null;
}

export function PdfUploadButton({ editor }: PdfUploadButtonProps) {
  async function handleClick() {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/pdf", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data?.message || "Upload failed");
          return;
        }

        editor.chain().focus().setPdf(data.data.url).run();
      } catch (error) {
        console.error("PDF upload failed:", error);
        alert("PDF upload failed");
      }
    };

    input.click();
  }

  return (
    <Button
      type="button"
      data-style="ghost"
      data-tooltip="Add PDF"
      onClick={handleClick}
    >
      Add PDF
    </Button>
  );
}
