import { Node } from "@tiptap/core";
export { AudioUploadNode as Audio } from "@/components/tiptap-node/audio-upload-node";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audio: {
      setAudio: (src: string) => ReturnType;
    };
  }
}

export const AudioUploadNode = Node.create({
  name: "audio",
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
        tag: "div[data-audio-wrapper]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-audio-wrapper": "" },
      [
        "audio",
        {
          ...HTMLAttributes,
          "data-audio": "",
          src: HTMLAttributes.src,
          controls: HTMLAttributes.controls ? "true" : null,
        },
      ],
    ];
  },

  addCommands() {
    return {
      setAudio:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src },
          }),
    };
  },
});
