import { Node } from "@tiptap/core";
export { VideoUploadNode as Video } from "@/components/tiptap-node/video-upload-node";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (src: string) => ReturnType;
    };
  }
}

export const VideoUploadNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-wrapper]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-video-wrapper": "" },
      [
        "video",
        {
          ...HTMLAttributes,
          "data-video": "",
          src: HTMLAttributes.src,
          controls: HTMLAttributes.controls ? "true" : null,
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVideo:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src },
          }),
    };
  },
});
