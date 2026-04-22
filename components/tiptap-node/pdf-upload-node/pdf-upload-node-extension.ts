import { Node, mergeAttributes } from "@tiptap/core";
import type { NodeType } from "@tiptap/pm/model";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { PdfUploadNode as PdfUploadNodeComponent } from "@/components/tiptap-node/pdf-upload-node/pdf-upload-node";

export type PdfUploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal,
) => Promise<string>;

export interface PdfUploadNodeOptions {
  type?: string | NodeType | undefined;
  accept?: string;
  limit?: number;
  maxSize?: number;
  upload?: PdfUploadFunction;
  onError?: (error: Error) => void;
  onSuccess?: (url: string) => void;
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pdfUpload: {
      setPdfUploadNode: (options?: PdfUploadNodeOptions) => ReturnType;
    };
  }
}

export const PdfUploadNode = Node.create<PdfUploadNodeOptions>({
  name: "pdfUpload",

  group: "block",
  draggable: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      type: "pdf",
      accept: "application/pdf",
      limit: 1,
      maxSize: 0,
      upload: undefined,
      onError: undefined,
      onSuccess: undefined,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      filename: {
        default: null,
      },
      accept: {
        default: this.options.accept,
      },
      limit: {
        default: this.options.limit,
      },
      maxSize: {
        default: this.options.maxSize,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-pdf-upload-node]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, filename, ...rest } = HTMLAttributes;

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, rest, {
        "data-pdf-upload-node": "",
        "data-filename": filename || "",
      }),
      [
        "iframe",
        {
          src,
          "data-pdf": "",
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfUploadNodeComponent);
  },

  addCommands() {
    return {
      setPdfUploadNode:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
          }),
    };
  },
});
