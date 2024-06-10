import { useRef, useState } from "react";
import styles from "./DragDropFiles.module.css";

export default function DragDropFiles() {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();
  const [tableName, setTableName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(e.dataTransfer.files);
  };
  // send files to the server
  const handleUpload = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("tableName", tableName);

    try {
      const response = await fetch("/uploadcsv", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        console.log("File Uploaded Successfully");

        setFiles(null);
        setTableName("");
      } else {
        console.error("Failed to upload file");
      }
    } catch (err) {
      console.error("error uploading file:");
    }
  };

  if (files) {
    return (
      <div>
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
        <form onSubmit={handleUpload}>
          <br />
          <label for="tableUploadInput">
            Enter the name of the table for your data:{" "}
          </label>
          <input
            id="tableUploadInput"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
          <br />
          <br />
          <button type="submit">Upload?</button>
        </form>
      </div>
    );
  }

  return (
    <>
      {!files && (
        <div className={styles.centerContent}>
          <div
            className={styles.dropBox}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p>Drag and drop files here</p>
          </div>
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            hidden
            ref={inputRef}
          />
          <button onClick={() => inputRef.current.click()}>Select Files</button>
        </div>
      )}
    </>
  );
}
