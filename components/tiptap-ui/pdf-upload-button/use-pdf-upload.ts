"use client";

import type { Editor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { isExtensionAvailable } from "@/lib/tiptap-utils";

export const PDF_UPLOAD_SHORTCUT_KEY = "mod+shift+p";

export interface UsePdfUploadConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onInserted?: () => void;
}

export function canInsertPdf(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "pdfUpload")) return false;

  return editor.can().insertContent({ type: "pdfUpload" });
}

export function isPdfActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("pdfUpload");
}

export function insertPdf(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertPdf(editor)) return false;

  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: "pdfUpload",
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
  if (!isExtensionAvailable(editor, "pdfUpload")) return false;

  if (!editor.isActive("code")) {
    return canInsertPdf(editor);
  }

  return true;
}

export function usePdfUpload(config?: UsePdfUploadConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertPdf(editor);
  const isActive = isPdfActive(editor);

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

  const handlePdf = useCallback(() => {
    if (!editor) return false;

    const success = insertPdf(editor);
    if (success) {
      onInserted?.();
    }

    return success;
  }, [editor, onInserted]);

  useHotkeys(
    PDF_UPLOAD_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handlePdf();
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
    handlePdf,
    canInsert,
    label: "Add PDF",
    shortcutKeys: PDF_UPLOAD_SHORTCUT_KEY,
  };
}
