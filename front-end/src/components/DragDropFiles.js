import { useRef, useState } from "react";
import styles from "./DragDropFiles.module.css";

export default function DragDropFiles() {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();
  const [tableName, setTableName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [isError, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(e.dataTransfer.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!files || !tableName) {
      console.error("No file or table name provided");
      setError("No file or table uploaded");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("tableName", tableName);

    try {
      console.log(formData);
      const response = await fetch("http://localhost:8000/uploadcsv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File Uploaded Successfully");

        setUploaded(true);
        setFiles(null);
        setTableName("");
        setError(null);
      } else {
        console.error("Failed to upload file");
        setError("Failed to upload file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading file");
    }
  };

  return (
    <div>
      {isError && <div>{isError}</div>}

      {files && (
        <div>
          <ul>
            {Array.from(files).map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>

          <form onSubmit={handleUpload}>
            <br />
            <label htmlFor="tableUploadInput">
              Enter the name of the table for your data:{" "}
            </label>
            <input
              id="tableUploadInput"
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
            {tableName}
            <br />
            <br />
            <button type="submit">Upload?</button>
          </form>
        </div>
      )}

      {uploaded && (
        <div>
          You uploaded your file congrats!
          <label htmlFor="reupload"> Upload again?</label>
          <button id="reupload" onClick={() => setUploaded(false)}>
            Click here!
          </button>
        </div>
      )}

      {!files && !uploaded && (
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
    </div>
  );
}
