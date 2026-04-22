"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import "@/components/tiptap-node/video-upload-node/video-upload-node.scss";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

function getLimitText(limit: number, maxSize: number) {
  const fileText = `Maximum ${limit} file${limit > 1 ? "s" : ""}`;
  const sizeText = maxSize > 0 ? `${formatBytes(maxSize)} each.` : "any size.";
  return `${fileText}, ${sizeText}`;
}

const CloudUploadIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="tiptap-upload-badge-icon"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.1953 4.41771C10.3478 4.08499 9.43578 3.94949 8.5282 4.02147C7.62062 4.09345 6.74133 4.37102 5.95691 4.83316C5.1725 5.2953 4.50354 5.92989 4.00071 6.68886C3.49788 7.44783 3.17436 8.31128 3.05465 9.2138C2.93495 10.1163 3.0222 11.0343 3.3098 11.8981C3.5974 12.7619 4.07781 13.5489 4.71463 14.1995C5.10094 14.5942 5.09414 15.2274 4.69945 15.6137C4.30476 16 3.67163 15.9932 3.28532 15.5985C2.43622 14.731 1.79568 13.6816 1.41221 12.5299C1.02875 11.3781 0.91241 10.1542 1.07201 8.95084C1.23162 7.74748 1.66298 6.59621 2.33343 5.58425C3.00387 4.57229 3.89581 3.72617 4.9417 3.10998C5.98758 2.4938 7.15998 2.1237 8.37008 2.02773C9.58018 1.93176 10.7963 2.11243 11.9262 2.55605C13.0561 2.99968 14.0703 3.69462 14.8919 4.58825C15.5423 5.29573 16.0585 6.11304 16.4177 7.00002H17.4999C18.6799 6.99991 19.8288 7.37933 20.7766 8.08222C21.7245 8.78515 22.4212 9.7743 22.7637 10.9036C23.1062 12.0328 23.0765 13.2423 22.6788 14.3534C22.2812 15.4644 21.5367 16.4181 20.5554 17.0736C20.0962 17.3803 19.4752 17.2567 19.1684 16.7975C18.8617 16.3382 18.9853 15.7172 19.4445 15.4105C20.069 14.9934 20.5427 14.3865 20.7958 13.6794C21.0488 12.9724 21.0678 12.2027 20.8498 11.4841C20.6318 10.7655 20.1885 10.136 19.5853 9.6887C18.9821 9.24138 18.251 8.99993 17.5001 9.00002H15.71C15.2679 9.00002 14.8783 8.70973 14.7518 8.28611C14.4913 7.41374 14.0357 6.61208 13.4195 5.94186C12.8034 5.27164 12.0427 4.75043 11.1953 4.41771Z"
      fill="currentColor"
    />
    <path
      d="M11 14.4142V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V14.4142L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L12.7078 11.2936C12.7054 11.2912 12.703 11.2888 12.7005 11.2864C12.5208 11.1099 12.2746 11.0008 12.003 11L12 11L11.997 11C11.8625 11.0004 11.7343 11.0273 11.6172 11.0759C11.502 11.1236 11.3938 11.1937 11.2995 11.2864C11.297 11.2888 11.2946 11.2912 11.2922 11.2936L7.29289 15.2929C6.90237 15.6834 6.90237 16.3166 7.29289 16.7071C7.68342 17.0976 8.31658 17.0976 8.70711 16.7071L11 14.4142Z"
      fill="currentColor"
    />
  </svg>
);

const FileIcon = () => (
  <svg
    width="43"
    height="57"
    viewBox="0 0 43 57"
    fill="currentColor"
    className="tiptap-upload-file-primary"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 10.75C0.75 5.64137 4.89137 1.5 10 1.5H32.3431C33.2051 1.5 34.0317 1.84241 34.6412 2.4519L40.2981 8.10876C40.9076 8.71825 41.25 9.5449 41.25 10.4069V46.75C41.25 51.8586 37.1086 56 32 56H10C4.89137 56 0.75 51.8586 0.75 46.75V10.75Z"
      fill="currentColor"
      fillOpacity="0.11"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const FileCornerIcon = () => (
  <svg
    width="10"
    height="10"
    className="tiptap-upload-file-secondary"
    viewBox="0 0 10 10"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0.75H0.343146C1.40401 0.75 2.42143 1.17143 3.17157 1.92157L8.82843 7.57843C9.57857 8.32857 10 9.34599 10 10.4069V10.75H4C1.79086 10.75 0 8.95914 0 6.75V0.75Z"
      fill="currentColor"
    />
  </svg>
);

export function VideoUploadNode(props: NodeViewProps) {
  const {
    node,
    updateAttributes,
    extension,
    selected,
    editor,
    getPos,
    deleteNode,
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const src = node.attrs.src as string | null;
  const filename = node.attrs.filename as string | null;

  const accept =
    (node.attrs.accept as string) || extension.options.accept || "video/*";
  const limit = Number(node.attrs.limit ?? extension.options.limit ?? 1);
  const maxSize = Number(node.attrs.maxSize ?? extension.options.maxSize ?? 0);

  const upload = extension.options.upload as
    | ((
        file: File,
        onProgress?: (event: { progress: number }) => void,
      ) => Promise<string>)
    | undefined;

  const label = useMemo(() => filename || "Video file", [filename]);
  const helperText = getLimitText(limit, maxSize);

  const runUpload = useCallback(
    async (file: File) => {
      if (maxSize > 0 && file.size > maxSize) {
        const error = new Error(
          `File size exceeds maximum allowed (${(maxSize / 1024 / 1024).toFixed(0)}MB)`,
        );
        setErrorMessage(error.message);
        extension.options.onError?.(error);
        return;
      }

      if (!upload) {
        const error = new Error("Upload function is not defined");
        setErrorMessage(error.message);
        extension.options.onError?.(error);
        return;
      }

      try {
        setIsUploading(true);
        setProgress(0);
        setErrorMessage("");

        updateAttributes({
          filename: file.name,
        });

        const url = await upload(file, (uploadEvent) => {
          setProgress(uploadEvent.progress);
        });

        updateAttributes({
          src: url,
          filename: file.name,
        });

        extension.options.onSuccess?.(url);

        const pos = typeof getPos === "function" ? getPos() : undefined;

        if (typeof pos === "number") {
          editor.commands.focus(pos + node.nodeSize);
        } else {
          editor.commands.focus();
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Video upload failed";
        setErrorMessage(message);
        extension.options.onError?.(
          error instanceof Error ? error : new Error(message),
        );
      } finally {
        setIsUploading(false);
        setIsDragging(false);
      }
    },
    [
      editor.commands,
      extension.options,
      getPos,
      maxSize,
      node.nodeSize,
      updateAttributes,
      upload,
    ],
  );

  const handleSelectClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      await runUpload(file);
    },
    [runUpload],
  );

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const file = event.dataTransfer.files?.[0];
      if (!file) return;

      await runUpload(file);
    },
    [runUpload],
  );

  if (src) {
    return (
      <NodeViewWrapper
        className={`tiptap-video-upload-node ${selected ? "ProseMirror-selectednode" : ""}`}
        data-video-upload-node=""
      >
        <div className="tiptap-video-upload-node__header">
          <div className="tiptap-video-upload-node__meta">
            <span className="tiptap-video-upload-node__title">{label}</span>
          </div>

          <div className="tiptap-video-upload-node__actions">
            <button
              type="button"
              className="tiptap-video-upload-node__action"
              onClick={handleSelectClick}
            >
              Replace
            </button>
            <button
              type="button"
              className="tiptap-video-upload-node__action"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>

        <video className="tiptap-video-upload-node__media" controls src={src} />

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={handleFileChange}
        />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className={`tiptap-video-upload-node ${selected ? "ProseMirror-selectednode" : ""} ${
        isDragging ? "is-dragging" : ""
      }`}
      data-video-upload-node=""
      tabIndex={0}
      onClick={handleSelectClick}
    >
      <div
        className={`tiptap-video-upload-node__dropzone ${isDragging ? "drag-over" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="tiptap-video-upload-node__content">
          <div className="tiptap-video-upload-node__dropzone-file">
            <FileIcon />
            <FileCornerIcon />
            <div className="tiptap-video-upload-node__icon-badge">
              <CloudUploadIcon />
            </div>
          </div>

          <div className="tiptap-video-upload-node__headline">
            <span className="tiptap-video-upload-node__headline-link">
              Click to upload
            </span>{" "}
            or drag and drop
          </div>

          <div className="tiptap-video-upload-node__helper">
            {isUploading ? `Uploading ${progress}%` : helperText}
          </div>

          {errorMessage ? (
            <div className="tiptap-video-upload-node__error">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={handleFileChange}
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    </NodeViewWrapper>
  );
}
