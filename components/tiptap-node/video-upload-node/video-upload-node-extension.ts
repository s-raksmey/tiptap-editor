import { Node, mergeAttributes } from "@tiptap/core";
import type { NodeType } from "@tiptap/pm/model";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { VideoUploadNode as VideoUploadNodeComponent } from "@/components/tiptap-node/video-upload-node/video-upload-node";

export type VideoUploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal,
) => Promise<string>;

export interface VideoUploadNodeOptions {
  type?: string | NodeType | undefined;
  accept?: string;
  limit?: number;
  maxSize?: number;
  upload?: VideoUploadFunction;
  onError?: (error: Error) => void;
  onSuccess?: (url: string) => void;
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoUpload: {
      setVideoUploadNode: (options?: VideoUploadNodeOptions) => ReturnType;
    };
  }
}

export const VideoUploadNode = Node.create<VideoUploadNodeOptions>({
  name: "videoUpload",

  group: "block",
  draggable: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      type: "video",
      accept: "video/*",
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
        tag: "div[data-video-upload-node]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, filename, ...rest } = HTMLAttributes;

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, rest, {
        "data-video-upload-node": "",
        "data-filename": filename || "",
      }),
      [
        "video",
        {
          src,
          controls: "true",
          "data-video": "",
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoUploadNodeComponent);
  },

  addCommands() {
    return {
      setVideoUploadNode:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
          }),
    };
  },
});
