import { useRef, useState } from "react";
import styles from "./DragDropFiles.module.css";

export default function DragDropFiles() {
  const [files, setFiles] = useState(null);
  const inputRef = useRef()

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(e.dataTransfer.files)

  }
  // send files to the server
  const handleUpload = () => {
    return null
  }

  if(files) {
    return (
        <div>
            <ul>
                {Array.from(files).map((file, idx)=> <li key={idx}>{file.name}</li>)}
            </ul>

            <button onClick={handleUpload}>
                Upload?
            </button>
        </div>
    )
  }

  return (
    <>
      {!files && (
        <div className={styles.centerContent}>
          <div className={styles.dropBox} onDragOver={handleDragOver} onDrop={handleDrop}>
            <p>Drag and drop files here</p>
          </div>
          <input type="file" onChange={(e)=> setFiles(e.target.files)} hidden ref={inputRef}/>
          <button onClick={()=> inputRef.current.click()}>Select Files</button>
        </div>
      )}
    </>
  );
}
