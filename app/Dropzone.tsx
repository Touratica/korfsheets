"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone() {
  const [message, setMessage] = useState("");
  const onDrop = async (acceptedFiles: any) => {
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setMessage("Upload successful!");
    } else {
      setMessage("Upload failed!");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag &apos;n drop some files here, or click to select files</p>
        )}
      </div>
      <p>{message}</p>
    </>
  );
}
