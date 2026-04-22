"use client";

import type { Editor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { isExtensionAvailable } from "@/lib/tiptap-utils";

export const AUDIO_UPLOAD_SHORTCUT_KEY = "mod+shift+a";

export interface UseAudioUploadConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onInserted?: () => void;
}

export function canInsertAudio(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "audioUpload")) return false;

  return editor.can().insertContent({ type: "audioUpload" });
}

export function isAudioActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("audioUpload");
}

export function insertAudio(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertAudio(editor)) return false;

  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: "audioUpload",
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
  if (!isExtensionAvailable(editor, "audioUpload")) return false;

  if (!editor.isActive("code")) {
    return canInsertAudio(editor);
  }

  return true;
}

export function useAudioUpload(config?: UseAudioUploadConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertAudio(editor);
  const isActive = isAudioActive(editor);

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

  const handleAudio = useCallback(() => {
    if (!editor) return false;

    const success = insertAudio(editor);
    if (success) {
      onInserted?.();
    }

    return success;
  }, [editor, onInserted]);

  useHotkeys(
    AUDIO_UPLOAD_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleAudio();
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
    handleAudio,
    canInsert,
    label: "Add audio",
    shortcutKeys: AUDIO_UPLOAD_SHORTCUT_KEY,
  };
}
