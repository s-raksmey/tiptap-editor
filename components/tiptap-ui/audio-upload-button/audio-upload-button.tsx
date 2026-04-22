"use client";

import { forwardRef, useCallback } from "react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { parseShortcutKeys } from "@/lib/tiptap-utils";

import type { UseAudioUploadConfig } from "@/components/tiptap-ui/audio-upload-button";
import {
  AUDIO_UPLOAD_SHORTCUT_KEY,
  useAudioUpload,
} from "@/components/tiptap-ui/audio-upload-button";

import { Badge } from "@/components/tiptap-ui-primitive/badge";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

export interface AudioUploadButtonProps
  extends Omit<ButtonProps, "type">, UseAudioUploadConfig {
  text?: string;
  showShortcut?: boolean;
}

export function AudioShortcutBadge({
  shortcutKeys = AUDIO_UPLOAD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const AudioUploadButton = forwardRef<
  HTMLButtonElement,
  AudioUploadButtonProps
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
    const { isVisible, canInsert, handleAudio, label, isActive, shortcutKeys } =
      useAudioUpload({
        editor,
        hideWhenUnavailable,
        onInserted,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleAudio();
      },
      [handleAudio, onClick],
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
            <span className="tiptap-button-text">{text ?? "Audio"}</span>
            {showShortcut && <AudioShortcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  },
);

AudioUploadButton.displayName = "AudioUploadButton";
