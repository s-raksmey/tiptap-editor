"use client";

import { forwardRef, useCallback } from "react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { parseShortcutKeys } from "@/lib/tiptap-utils";

import type { UsePdfUploadConfig } from "@/components/tiptap-ui/pdf-upload-button";
import {
  PDF_UPLOAD_SHORTCUT_KEY,
  usePdfUpload,
} from "@/components/tiptap-ui/pdf-upload-button";

import { Badge } from "@/components/tiptap-ui-primitive/badge";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

export interface PdfUploadButtonProps
  extends Omit<ButtonProps, "type">, UsePdfUploadConfig {
  text?: string;
  showShortcut?: boolean;
}

export function PdfShortcutBadge({
  shortcutKeys = PDF_UPLOAD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const PdfUploadButton = forwardRef<
  HTMLButtonElement,
  PdfUploadButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onInserted,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const { isVisible, canInsert, handlePdf, label, isActive, shortcutKeys } =
      usePdfUpload({
        editor,
        hideWhenUnavailable,
        onInserted,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handlePdf();
      },
      [handlePdf, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <span className="tiptap-button-text">{text ?? "PDF"}</span>
            {showShortcut && <PdfShortcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  },
);

PdfUploadButton.displayName = "PdfUploadButton";
