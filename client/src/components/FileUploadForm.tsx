import React, { useRef, useState, useEffect } from "react";
import { URL } from "../utility";

function FileUploadForm() {
  const fileJourney = useRef<HTMLInputElement>(null);

  const fileStation = useRef<HTMLInputElement>(null);
  // Handle File from server
  const [notValidDataFile, setNotValidDataFile] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetching journeys data based on page

  // Handle upload file
  const handleSubmitJourneyFile = (event: React.FormEvent) => {
    event.preventDefault();

    const file = (fileJourney as any).current?.files[0];

    if (!file) {
      alert("No journey file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    fetch(`${URL}/uploadJourney`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setNotValidDataFile(data.fileName);
          setLoading(false);
        }
      });
  };

  const handleSubmitStationFile = (event: React.FormEvent) => {
    event.preventDefault();

    const file = (fileStation as any).current?.files[0];

    if (!file) {
      alert("No station file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    fetch(`${URL}/uploadStation`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setLoading(false);
        }
      })
      .catch((err) => {
        throw new Error("submit station file failed " + err);
      });
  };

  const handleDownloadFile = () => {
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
      });
  };

  return (
    <div className="container">
      <div style={{ margin: "20px 0 " }}>
        <div>
          <form onSubmit={handleSubmitJourneyFile}>
            <h3>Select .csv file for journey:</h3>
            <input type="file" ref={fileJourney} />
            <button className="custom-btn" type="submit" disabled={loading}>
              Upload Journey
            </button>
          </form>
          <div>
            {notValidDataFile !== "" && (
              <>
                <p>{notValidDataFile}</p>
                <button
                  className="custom-btn"
                  onClick={() => handleDownloadFile()}
                >
                  Download
                </button>
              </>
            )}
          </div>
        </div>
        <hr />
        <form onSubmit={handleSubmitStationFile}>
          <h3>Select .csv file for station:</h3>
          <input type="file" ref={fileStation} />
          <button className="custom-btn" type="submit" disabled={loading}>
            Upload Station
          </button>
        </form>
      </div>
    </div>
  );
}

export default FileUploadForm;
