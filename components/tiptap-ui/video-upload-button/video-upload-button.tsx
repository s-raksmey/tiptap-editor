"use client";

import { forwardRef, useCallback } from "react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { parseShortcutKeys } from "@/lib/tiptap-utils";

import type { UseVideoUploadConfig } from "@/components/tiptap-ui/video-upload-button";
import {
  VIDEO_UPLOAD_SHORTCUT_KEY,
  useVideoUpload,
} from "@/components/tiptap-ui/video-upload-button";

import { Badge } from "@/components/tiptap-ui-primitive/badge";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

export interface VideoUploadButtonProps
  extends Omit<ButtonProps, "type">, UseVideoUploadConfig {
  text?: string;
  showShortcut?: boolean;
}

export function VideoShortcutBadge({
  shortcutKeys = VIDEO_UPLOAD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const VideoUploadButton = forwardRef<
  HTMLButtonElement,
  VideoUploadButtonProps
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
    const { isVisible, canInsert, handleVideo, label, isActive, shortcutKeys } =
      useVideoUpload({
        editor,
        hideWhenUnavailable,
        onInserted,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleVideo();
      },
      [handleVideo, onClick],
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
            <span className="tiptap-button-text">{text ?? "Video"}</span>
            {showShortcut && <VideoShortcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  },
);

VideoUploadButton.displayName = "VideoUploadButton";
