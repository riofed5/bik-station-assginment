import React, { useRef, useState } from "react";

function FileUploadForm() {
  const fileInput = useRef<HTMLInputElement>(null);

  // Handle File from server
  const [notValidDataFile, setNotValidDataFile] = useState("");

  // Handle upload file
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const file = (fileInput as any).current?.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    alert("File send to server");

    fetch("http://localhost:7000/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data::", data);
        if (data.status) {
          setNotValidDataFile(data.fileName);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" ref={fileInput} />
        <button type="submit">Upload</button>
      </form>
      <div>
        {notValidDataFile !== "" && (
          <>
            <p>{notValidDataFile}</p>
            <button
              onClick={() =>
                fetch("http://localhost:7000/api/download")
                  .then((response) => response.blob())
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    // the filename you want
                    a.download = `${notValidDataFile}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                  })
              }
            >
              Download
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default FileUploadForm;
