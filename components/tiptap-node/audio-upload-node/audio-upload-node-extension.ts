import { Node, mergeAttributes } from "@tiptap/core";
import type { NodeType } from "@tiptap/pm/model";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { AudioUploadNode as AudioUploadNodeComponent } from "@/components/tiptap-node/audio-upload-node/audio-upload-node";

export type AudioUploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal,
) => Promise<string>;

export interface AudioUploadNodeOptions {
  type?: string | NodeType | undefined;
  accept?: string;
  limit?: number;
  maxSize?: number;
  upload?: AudioUploadFunction;
  onError?: (error: Error) => void;
  onSuccess?: (url: string) => void;
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audioUpload: {
      setAudioUploadNode: (options?: AudioUploadNodeOptions) => ReturnType;
    };
  }
}

export const AudioUploadNode = Node.create<AudioUploadNodeOptions>({
  name: "audioUpload",

  group: "block",
  draggable: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      type: "audio",
      accept: "audio/*",
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
        tag: "div[data-audio-upload-node]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, filename, ...rest } = HTMLAttributes;

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, rest, {
        "data-audio-upload-node": "",
        "data-filename": filename || "",
      }),
      [
        "audio",
        {
          src,
          controls: "true",
          "data-audio": "",
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioUploadNodeComponent);
  },

  addCommands() {
    return {
      setAudioUploadNode:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
          }),
    };
  },
});
