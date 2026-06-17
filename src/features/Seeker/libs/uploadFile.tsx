import React from "react"

export interface File {
  id: string;
  name: string;
  size: string;
  raw?: globalThis.File;
  url?: string;
}

type UploadKind = "pdf" | "image";

type uploadProp = {
  onUpload: (resume: File) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  kind?: UploadKind;
};

const UPLOAD_CONFIG: Record<UploadKind, {
  accept: string;
  maxSizeMb: number;
  extensions: string[];
  invalidTypeMessage: string;
}> = {
  pdf: {
    accept: "application/pdf,.pdf",
    maxSizeMb: 5,
    extensions: [".pdf"],
    invalidTypeMessage: "Only PDF files are accepted.",
  },
  image: {
    accept: "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp",
    maxSizeMb: 5,
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    invalidTypeMessage: "Only image files are accepted (JPG, PNG, GIF, WEBP).",
  },
};

const Upload = ({ onUpload, inputRef, kind = "pdf" }: uploadProp) => {
  const config = UPLOAD_CONFIG[kind];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const hasAllowedExtension = config.extensions.some((extension) => lowerName.endsWith(extension));
    const hasAllowedMime = kind === "image"
      ? file.type.startsWith("image/")
      : file.type === "application/pdf";

    if (!hasAllowedExtension && !hasAllowedMime) {
      alert(config.invalidTypeMessage);
      e.target.value = '';
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > config.maxSizeMb) {
      alert(`File size should be lower than ${config.maxSizeMb} MB`);
      e.target.value = '';
      return;
    }

    onUpload({
      id: crypto.randomUUID(),
      name: file.name,
      size: `${fileSizeMB.toFixed(1)} MB`,
      raw: file,
      url: URL.createObjectURL(file),
    });
    e.target.value = '';
  };

  return (
    <input
      ref={inputRef}
      type="file"
      accept={config.accept}
      onChange={handleUpload}
      className="h-full w-full text-sm text-transparent"
    />
  );
};

export default Upload;
