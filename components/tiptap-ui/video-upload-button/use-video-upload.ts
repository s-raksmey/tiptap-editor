"use client";

import type { Editor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { isExtensionAvailable } from "@/lib/tiptap-utils";

export const VIDEO_UPLOAD_SHORTCUT_KEY = "mod+shift+v";

export interface UseVideoUploadConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onInserted?: () => void;
}

export function canInsertVideo(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "videoUpload")) return false;

  return editor.can().insertContent({ type: "videoUpload" });
}

export function isVideoActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("videoUpload");
}

export function insertVideo(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertVideo(editor)) return false;

  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: "videoUpload",
      })
      .run();
  } catch {
    return false;
  }
}

export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;

  if (!hideWhenUnavailable) return true;
  if (!isExtensionAvailable(editor, "videoUpload")) return false;

  if (!editor.isActive("code")) {
    return canInsertVideo(editor);
  }

  return true;
}

export function useVideoUpload(config?: UseVideoUploadConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertVideo(editor);
  const isActive = isVideoActive(editor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleVideo = useCallback(() => {
    if (!editor) return false;

    const success = insertVideo(editor);
    if (success) {
      onInserted?.();
    }

    return success;
  }, [editor, onInserted]);

  useHotkeys(
    VIDEO_UPLOAD_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleVideo();
    },
    {
      enabled: isVisible && canInsert,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    },
  );

  return {
    isVisible,
    isActive,
    handleVideo,
    canInsert,
    label: "Add video",
    shortcutKeys: VIDEO_UPLOAD_SHORTCUT_KEY,
  };
}
