import { Node } from "@tiptap/core";
export { PdfUploadNode as Pdf } from "@/components/tiptap-node/pdf-upload-node";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pdf: {
      setPdf: (src: string) => ReturnType;
    };
  }
}

export const PdfUploadNode = Node.create({
  name: "pdf",

  group: "block",

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-pdf-wrapper]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-pdf-wrapper": "",
      },
      [
        "iframe",
        {
          ...HTMLAttributes,
          "data-pdf": "",
          src: HTMLAttributes.src,
        },
      ],
    ];
  },

  addCommands() {
    return {
      setPdf:
        (src: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src },
          });
        },
    };
  },
});
