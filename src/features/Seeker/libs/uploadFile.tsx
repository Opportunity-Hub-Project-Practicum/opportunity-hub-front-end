import React from "react"

export interface File {
  id: string;
  name: string;
  size: string;
  raw?: globalThis.File;
}

type uploadProp = {
  onUpload: (resume: File) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;

};
const Upload = ({ onUpload, inputRef }: uploadProp) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      alert("only Pdf file is accepted");
      e.target.value = '';
      return;
    }

    const maxSize = 5;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSize) {
      alert(`file size should be lower than ${maxSize}`);
      e.target.value = '';
      return;
    }


    onUpload({
      id: crypto.randomUUID(),
      name: file.name.replace(/\.pdf$/i, ""),
      size: `${fileSizeMB.toFixed(1)} MB`,
      raw: file,
    });
    e.target.value = '';

  };
  return (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf,.pdf"
      onChange={handleUpload}
      className={`h-full w-full text-sm text-transparent `}

    />
  );
};
export default Upload;