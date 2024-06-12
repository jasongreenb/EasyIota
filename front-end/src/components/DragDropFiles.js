import { useRef, useState } from "react";
import styles from "./DragDropFiles.module.css";

export default function DragDropFiles() {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();
  const [tableName, setTableName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [isError, setError] = useState(null);
  const [response, setResponse] = useState("");

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
      const response = await fetch("http://localhost:8000/api/uploadcsv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setResponse(responseData);
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
    <div className={styles.container}>
      {isError && <div className={styles.error}>{isError}</div>}

      {files && (
        <div>
          <ul className={styles.filesList}>
            {Array.from(files).map((file, idx) => (
              <li key={idx}>Uploaded file: {file.name}</li>
            ))}
          </ul>

          <form className={styles.uploadForm} onSubmit={handleUpload}>
            <label htmlFor="tableUploadInput">
              Enter the name of the table for your data:{" "}
            </label>
            <input
              id="tableUploadInput"
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
            <br />
            <button type="submit">Upload</button>
          </form>
        </div>
      )}

      {uploaded && (
        <div className={styles.successMessage}>
          File uploaded successfully, if you want to upload again click --
          <button onClick={() => setUploaded(false)}>Upload again</button>
          <div>
            Response message: {response.message}
            <br />
            <br />
            <br />
            Results: {JSON.stringify(response.results, null, 2)}
          </div>
        </div>
      )}

      {!files && !uploaded && (
        <div
          className={styles.dragDropContainer}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p>Drag and drop a file here (csv)</p>
          <button
            className={styles.selectFileButton}
            onClick={() => inputRef.current.click()}
          >
            Select a File (csv)
          </button>
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            hidden
            ref={inputRef}
          />
        </div>
      )}
    </div>
  );
}
