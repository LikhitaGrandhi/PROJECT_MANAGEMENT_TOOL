import { useState } from "react";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // PUT YOUR REAL PROJECT _id HERE
  const projectId = "6ab57dfee5f99a08519996a9";

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    if (!projectId) {
      setMessage("Project ID is missing.");
      return;
    }

    const formData = new FormData();

    // File
    formData.append("file", selectedFile);

    // Project ID
    formData.append("projectId", projectId);

    // Login token
    const token = localStorage.getItem("token");

    try {
      setUploading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5001/api/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("File uploaded successfully!");
      setSelectedFile(null);

    } catch (error) {
      console.error("Upload error:", error);
      setMessage(error.message || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>

      <input
        type="file"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {selectedFile && (
        <p>Selected: {selectedFile.name}</p>
      )}

      {message && (
        <p>{message}</p>
      )}
    </div>
  );
}

export default FileUpload;